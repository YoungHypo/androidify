import Foundation
import UIKit
import FirebaseAI
import FirebaseCore

// AI Service Models
struct ImageGenerationRequest {
    let description: String
    let colorHex: String
    let style: String = "android_bot_3d"
    let quality: ImageQuality = .high
}

enum ImageQuality {
    case standard
    case high
}

struct ImageGenerationResponse {
    let imageData: Data
    let metadata: GenerationMetadata
}

struct GenerationMetadata {
    let generationTime: TimeInterval
    let promptUsed: String
}

enum AIServiceError: LocalizedError {
    case invalidResponse
    case networkError
    case invalidImageData
    case apiKeyMissing
    case firebaseNotConfigured
    case contentFiltered(String)
    case modelError(String)
    
    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Invalid response from AI service"
        case .networkError:
            return "Network connection error"
        case .invalidImageData:
            return "Invalid image data received"
        case .apiKeyMissing:
            return "API key is missing"
        case .firebaseNotConfigured:
            return "Firebase is not configured"
        case .contentFiltered(let reason):
            return "Content filtered by safety filter: \(reason)"
        case .modelError(let message):
            return "Model error: \(message)"
        }
    }
}

// AI Service Protocol
protocol AIServiceProtocol {
    func generateImage(from request: ImageGenerationRequest) async throws -> UIImage
    func validatePrompt(_ prompt: String) async throws -> Bool
}

// AI Service Implementation
class AIService: AIServiceProtocol {
    
    // Firebase AI Logic service
    private let ai: FirebaseAI
    private let textModel: GenerativeModel
    private let imagenModel: ImagenModel
    
    init() throws {
        // Ensure Firebase is initialized
        guard let _ = FirebaseApp.app() else {
            throw AIServiceError.firebaseNotConfigured
        }
        
        // Initialize Firebase AI Logic (using Gemini Developer API)
        self.ai = FirebaseAI.firebaseAI(backend: .googleAI())
        
        // Create text generation model (for prompt enhancement and validation)
        self.textModel = ai.generativeModel(modelName: "gemini-2.5-pro-preview-03-25")
        
        // Create image generation model (Imagen 3)
        self.imagenModel = ai.imagenModel(
            modelName: "imagen-3.0-generate-002",
            generationConfig: ImagenGenerationConfig(numberOfImages: 1)
        )
    }
    
    // Main image generation function
    func generateImage(from request: ImageGenerationRequest) async throws -> UIImage {
        let startTime = Date()
        
        do {
            // 1. Validate prompt
            let isValid = try await validatePrompt(request.description)
            guard isValid else {
                throw AIServiceError.contentFiltered("Prompt contains inappropriate content")
            }
            
            // 2. Build prompt directly using fallback
            let prompt = buildFallbackPrompt(from: request.description, colorHex: request.colorHex)
            
            // 3. Use Imagen model to generate image
            let response = try await imagenModel.generateImages(prompt: prompt)
            
            // 4. Check if there is a filter reason
            if let filteredReason = response.filteredReason {
                throw AIServiceError.contentFiltered(filteredReason)
            }
            
            // 5. Get the generated image
            guard let imageData = response.images.first else {
                throw AIServiceError.invalidResponse
            }
            
            // 6. Convert to UIImage
            guard let uiImage = UIImage(data: imageData.data) else {
                throw AIServiceError.invalidImageData
            }
            
            let generationTime = Date().timeIntervalSince(startTime)
            print("✅ Image generation successful! Time taken: \(String(format: "%.2f", generationTime)) seconds")
            print("✅ Used prompt: \(prompt)")
            
            return uiImage
            
        } catch let error as AIServiceError {
            throw error
        } catch {
            print("❌ Image generation failed: \(error.localizedDescription)")
            throw AIServiceError.modelError(error.localizedDescription)
        }
    }
    
    // Prompt validation
    func validatePrompt(_ prompt: String) async throws -> Bool {
        let validationPrompt = """
        Please analyze the following description for Android robot generation and determine if it is safe and appropriate.
        Just answer "SAFE" or "UNSAFE", do not add any other content.
        
        Description: "\(prompt)"
        """
        
        do {
            let response = try await textModel.generateContent(validationPrompt)
            guard let text = response.text else {
                throw AIServiceError.invalidResponse
            }
            
            return text.trimmingCharacters(in: .whitespacesAndNewlines).uppercased() == "SAFE"
        } catch {
            // If validation fails, return false for safety
            return false
        }
    }
    
    // Fallback prompt building
    private func buildFallbackPrompt(from description: String, colorHex: String) -> String {
        return """
        Create a 3D rendered, cartoonish Android mascot in a photorealistic style.
        The pose is relaxed and straightforward, facing directly forward with shoulders at ease,
        as if posing for a photo. The cartoonish exaggeration is subtle, lending a playful touch
        to the otherwise realistic rendering of the figure.
        
        The bot should take on the body shape of the newest Google Android Robot with distinctive
        rounded body, semi-circular head with two short, straight antennae, and simple cylindrical
        arms and legs.
        
        Description: \(description)
        Primary color: \(colorHex)
        
        The figure is centered against a muted, neutral warm cream colored background (#F8F2E4)
        giving the figurine a unique and collectible appeal.
        """
    }
}

protocol NetworkServiceProtocol {
    func performRequest<T: Codable>(_ request: URLRequest, responseType: T.Type) async throws -> T
}

class NetworkService: NetworkServiceProtocol {
    func performRequest<T: Codable>(_ request: URLRequest, responseType: T.Type) async throws -> T {
        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(T.self, from: data)
    }
}

// Firebase configuration extension
extension AIService {
    static func configure() {
        // Ensure Firebase is configured before using AIService
        if FirebaseApp.app() == nil {
            FirebaseApp.configure()
        }
    }
} 