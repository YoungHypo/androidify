import SwiftUI
import Combine

// View States
enum CreationViewState {
    case idle
    case editing
    case generating
    case completed(UIImage)
    case error(Error)
}

// Generated Bot Model
struct GeneratedBot {
    let id: UUID
    let originalDescription: String
    let selectedColor: BotColor
    let image: UIImage
    let creationDate: Date
    let generationTime: TimeInterval
}

// Creation Errors
enum CreationError: LocalizedError {
    case emptyDescription
    case generationFailed
    case networkUnavailable
    case serviceInitializationFailed
    
    var errorDescription: String? {
        switch self {
        case .emptyDescription:
            return "Please enter a description for your bot"
        case .generationFailed:
            return "Failed to generate your bot. Please try again."
        case .networkUnavailable:
            return "Network connection unavailable. Please check your network connection and try again."
        case .serviceInitializationFailed:
            return "AI service initialization failed. Please ensure Firebase is configured correctly."
        }
    }
}

// Creation ViewModel
@MainActor
class CreationViewModel: ObservableObject {
    @Published var viewState: CreationViewState = .idle
    @Published var description: String = ""
    @Published var selectedColor: BotColor = BotColor.defaultAndroidGreen
    @Published var isGenerating: Bool = false
    @Published var generatedBot: GeneratedBot?
    @Published var currentProgress: Double = 0.0
    @Published var currentMessage: String = ""
    
    private let aiService: AIServiceProtocol
    private let encouragingMessages = [
        "Oh, this is going to be great...",
        "Now... starting to paint",
        "Great! Now let's try this",
        "Hold on, hold on, just one more stroke...",
        "Yes, that looks good!",
        "Aha... even better...",
        "Now just some final touches..."
    ]
    
    private var messageTimer: Timer?
    private var currentMessageIndex = 0
    
    // New convenience initializer
    convenience init() throws {
        // Configure Firebase
        AIService.configure()
        
        // Create AI service instance
        let aiService = try AIService()
        self.init(aiService: aiService)
    }
    
    init(aiService: AIServiceProtocol) {
        self.aiService = aiService
    }
    
    var canStartGeneration: Bool {
        return !description.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty && !isGenerating
    }
    
    // Main Generation Function
    func startBotGeneration() {
        guard canStartGeneration else {
            viewState = .error(CreationError.emptyDescription)
            return
        }
        
        startGenerationProcess()
    }
    
    private func startGenerationProcess() {
        isGenerating = true
        viewState = .generating
        currentProgress = 0.0
        currentMessageIndex = 0
        
        startEncouragingMessages()
        animateProgress()
        
        Task {
            do {
                let startTime = Date()
                
                let request = ImageGenerationRequest(
                    description: description,
                    colorHex: selectedColor.hexValue
                )
                
                let generatedImage = try await aiService.generateImage(from: request)
                let generationTime = Date().timeIntervalSince(startTime)
                
                let bot = GeneratedBot(
                    id: UUID(),
                    originalDescription: description,
                    selectedColor: selectedColor,
                    image: generatedImage,
                    creationDate: Date(),
                    generationTime: generationTime
                )
                
                await MainActor.run {
                    stopEncouragingMessages()
                    isGenerating = false
                    generatedBot = bot
                    viewState = .completed(generatedImage)
                    print("✅ Bot generation completed! Time taken: \(String(format: "%.2f", generationTime)) seconds")
                }
                
            } catch let error as AIServiceError {
                await MainActor.run {
                    stopEncouragingMessages()
                    isGenerating = false
                    print("❌ AI service error: \(error.localizedDescription)")
                    viewState = .error(error)
                }
            } catch {
                await MainActor.run {
                    stopEncouragingMessages()
                    isGenerating = false
                    print("❌ Unknown error: \(error.localizedDescription)")
                    viewState = .error(CreationError.generationFailed)
                }
            }
        }
    }
    
    // Progress Animation
    private func animateProgress() {
        currentProgress = 0.0
        
        Timer.scheduledTimer(withTimeInterval: 0.1, repeats: true) { timer in
            Task { @MainActor in
                if self.isGenerating {
                    // Simulate progressive progress, but slightly speed it up to match real AI generation
                    let increment = Double.random(in: 0.008...0.025)
                    self.currentProgress = min(self.currentProgress + increment, 0.95)
                } else {
                    self.currentProgress = 1.0
                    timer.invalidate()
                }
            }
        }
    }
    
    // Encouraging Messages
    private func startEncouragingMessages() {
        currentMessage = encouragingMessages[0]
        
        messageTimer = Timer.scheduledTimer(withTimeInterval: 2.0, repeats: true) { _ in
            Task { @MainActor in
                self.currentMessageIndex = (self.currentMessageIndex + 1) % self.encouragingMessages.count
                self.currentMessage = self.encouragingMessages[self.currentMessageIndex]
            }
        }
    }
    
    private func stopEncouragingMessages() {
        messageTimer?.invalidate()
        messageTimer = nil
    }
    
    // Reset Function
    func resetToEditingMode() {
        viewState = .idle
        isGenerating = false
        generatedBot = nil
        currentProgress = 0.0
        currentMessage = ""
        stopEncouragingMessages()
    }
    
    // Save Function
    func saveToPhotoLibrary() {
        guard let bot = generatedBot else { return }
        UIImageWriteToSavedPhotosAlbum(bot.image, nil, nil, nil)
    }
}

// BotColor Extension
extension BotColor {
    var hexValue: String {
        switch id {
        case "android_green":
            return "#50C168"
        case "blue":
            return "#4285F4"
        case "red":
            return "#EA4335"
        case "yellow":
            return "#FBBC05"
        case "orange":
            return "#FF6D01"
        case "purple":
            return "#9C27B0"
        case "pink":
            return "#E91E63"
        case "teal":
            return "#009688"
        default:
            return "#50C168"
        }
    }
} 
