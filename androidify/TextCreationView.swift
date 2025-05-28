import SwiftUI

// Input Type Enum
enum InputType {
    case photo
    case prompt
}

// Bot Color Model
struct BotColor {
    let id: String
    let name: String
    let displayColor: Color
    
    static let defaultAndroidGreen = BotColor(
        id: "android_green",
        name: "Android Green",
        displayColor: Color(red: 0.31, green: 0.76, blue: 0.41)
    )
}

// Main Text Creation View
struct TextCreationView: View {
    @StateObject private var viewModel: CreationViewModel
    @State private var selectedInputType: InputType = .prompt
    @FocusState private var isTextEditorFocused: Bool
    
    init() {
        // Use new AIService initialization method
        do {
            let aiService = try AIService()
            self._viewModel = StateObject(wrappedValue: CreationViewModel(aiService: aiService))
        } catch {
            // If AIService initialization fails, use Mock service
            print("⚠️ AIService initialization failed: \(error). Using Mock service.")
            let mockAIService = MockAIService()
            self._viewModel = StateObject(wrappedValue: CreationViewModel(aiService: mockAIService))
        }
    }
    
    var body: some View {
        switch viewModel.viewState {
        case .idle, .editing:
            mainEditingView
        case .generating:
            GenerationProgressView(viewModel: viewModel)
        case .completed(let image):
            ResultsView(viewModel: viewModel, generatedImage: image)
        case .error(let error):
            errorView(error)
        }
    }
    
    // Main Editing View
    private var mainEditingView: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header
                headerView
                
                // Main Content
                ScrollView {
                    VStack(spacing: 20) {
                        // Toggle Buttons (Photo/Prompt)
                        toggleSelectionView
                        
                        // Text Input Section
                        if selectedInputType == .prompt {
                            textInputSection
                        }
                        
                        // Bottom buttons
                        HStack(spacing: 16) {
                            // Bot Color Selection
                            colorSelectionButton
                            
                            // Transform Button
                            transformButton
                        }
                        .padding(.horizontal, 20)
                        .padding(.bottom, 30)
                    }
                }
                .padding(.top, 30)
                .background(
                    LinearGradient(
                        colors: [
                            Color(red: 0.89, green: 0.95, blue: 0.89),
                            Color(red: 0.31, green: 0.76, blue: 0.41)
                        ],
                        startPoint: .top,
                        endPoint: .bottom
                    )
                )
            }
            .navigationBarHidden(true)
        }
    }
    
    // Header View
    private var headerView: some View {
        HStack {
            Spacer()
            
            Text("Androidify")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(.black)
            
            Spacer()
        }
        .padding(.horizontal, 20)
        .padding(.vertical, 15)
        .background(
            RoundedRectangle(cornerRadius: 25)
                .fill(Color.white)
                .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
        )
        .padding(.horizontal, 16)
        .padding(.top, 10)
    }
    
    // Toggle Selection View
    private var toggleSelectionView: some View {
        HStack(spacing: 0) {
            // Photo option
            Button("Photo") {
                selectedInputType = .photo
            }
            .foregroundColor(selectedInputType == .photo ? .white : .black)
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(
                selectedInputType == .photo ? Color.black : Color.clear
            )
            
            // Prompt option  
            Button("Prompt") {
                selectedInputType = .prompt
            }
            .foregroundColor(selectedInputType == .prompt ? .white : .black)
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(
                selectedInputType == .prompt ? Color.black : Color.clear
            )
        }
        .background(Color.gray.opacity(0.2))
        .clipShape(Capsule())
        .overlay(
            Capsule()
                .stroke(Color.black, lineWidth: 2)
        )
        .padding(.horizontal, 20)
        .animation(.easeInOut(duration: 0.2), value: selectedInputType)
    }
    
    // Text Input Section
    private var textInputSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header with icon and title
            HStack(spacing: 8) {
                Image(systemName: "sparkles")
                    .foregroundColor(.black)
                    .font(.title3)
                Text("My bot is...")
                    .font(.title2)
                    .fontWeight(.medium)
                    .foregroundColor(.black)
                Spacer()
            }
            .padding(.horizontal, 20)
            
            // Main text input area with dashed border
            ZStack {
                // Dashed border background
                RoundedRectangle(cornerRadius: 16)
                    .stroke(
                        style: StrokeStyle(
                            lineWidth: 2,
                            lineCap: .round,
                            lineJoin: .round,
                            dash: [8, 6]
                        )
                    )
                    .foregroundColor(.black.opacity(0.8))
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color.white.opacity(0.1))
                    )
                
                VStack(spacing: 0) {
                    // Text Editor Area
                    ZStack(alignment: .topLeading) {
                        // Text Editor
                        TextEditor(text: $viewModel.description)
                            .font(.title3)
                            .padding(.horizontal, 16)
                            .padding(.top, 16)
                            .frame(minHeight: 120)
                            .background(Color.clear)
                            .focused($isTextEditorFocused)
                            .scrollContentBackground(.hidden)
                        
                        // Placeholder text
                        if viewModel.description.isEmpty && !isTextEditorFocused {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Describe clothing, accessories,")
                                    .foregroundColor(.gray.opacity(0.8))
                                Text("hairstyles, or any unique traits")
                                    .foregroundColor(.gray.opacity(0.8))
                                Text("to make your bot a reflection of")
                                    .foregroundColor(.gray.opacity(0.8))
                                Text("yourself.")
                                    .foregroundColor(.gray.opacity(0.8))
                            }
                            .font(.title3)
                            .padding(.horizontal, 20)
                            .padding(.top, 20)
                            .allowsHitTesting(false)
                        }
                    }
                    
                    Spacer()
                    
                    // Bottom section with help button
                    VStack(spacing: 16) {
                        // Help me write button
                        helpMeWriteButton
                            .padding(.bottom, 16)
                    }
                }
            }
            .frame(height: 480)
            .padding(.horizontal, 20)
        }
    }

    
    // Help Me Write Button
    private var helpMeWriteButton: some View {
        Button(action: {
            // Help me write action
        }) {
            HStack(spacing: 8) {
                Image(systemName: "sparkles")
                    .foregroundColor(.black)
                Text("Help me write")
                    .foregroundColor(.black)
            }
            .font(.system(size: 16, weight: .medium))
            .padding(.horizontal, 20)
            .padding(.vertical, 10)
            .background(Color.white)
            .cornerRadius(15)
            .shadow(color: .black.opacity(0.15), radius: 3, x: 0, y: 2)
        }
    }
    
    // Color Selection Button
    private var colorSelectionButton: some View {
        Button(action: {
            // Color selection action
        }) {
            HStack(spacing: 12) {
                // Color indicator
                Circle()
                    .fill(viewModel.selectedColor.displayColor)
                    .frame(width: 24, height: 24)
                    .overlay(
                        Circle()
                            .stroke(Color.black.opacity(0.3), lineWidth: 1)
                    )
                
                Text("Bot color")
                    .foregroundColor(.black)
                    .font(.system(size: 16, weight: .medium))
                
                Spacer()
            }
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .background(Color.white)
            .cornerRadius(25)
            .overlay(
                RoundedRectangle(cornerRadius: 25)
                    .stroke(Color.black, lineWidth: 2)
            )
            .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
        }
    }
    
    // Transform Button
    private var transformButton: some View {
        Button(action: {
            viewModel.startBotGeneration()
        }) {
            HStack(spacing: 8) {
                if viewModel.isGenerating {
                    ProgressView()
                        .scaleEffect(0.8)
                        .tint(.white)
                    Text("Transforming...")
                } else {
                    Text("Transform")
                    Image(systemName: "arrow.right")
                        .font(.system(size: 14, weight: .semibold))
                }
            }
            .foregroundColor(.white)
            .font(.system(size: 16, weight: .semibold))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(viewModel.canStartGeneration ? Color.black : Color.gray.opacity(0.3))
            .cornerRadius(25)
            .shadow(color: .black.opacity(0.3), radius: 4, x: 0, y: 2)
        }
        .disabled(!viewModel.canStartGeneration)
        .opacity(viewModel.canStartGeneration ? 1.0 : 0.6)
    }
    
    // Error View
    private func errorView(_ error: Error) -> some View {
        VStack(spacing: 20) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 48))
                .foregroundColor(.orange)
            
            Text("Oops! Something went wrong")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(.black)
            
            Text(error.localizedDescription)
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundColor(.gray)
                .padding(.horizontal, 40)
            
            Button("Try Again") {
                viewModel.resetToEditingMode()
            }
            .font(.headline)
            .foregroundColor(.white)
            .padding(.horizontal, 32)
            .padding(.vertical, 16)
            .background(Color.black)
            .cornerRadius(25)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            LinearGradient(
                colors: [
                    Color(red: 0.89, green: 0.95, blue: 0.89),
                    Color(red: 0.31, green: 0.76, blue: 0.41)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
        )
    }
}

// Preview
struct TextCreationView_Previews: PreviewProvider {
    static var previews: some View {
        TextCreationView()
    }
}

// Mock AI Service for fallback
private class MockAIService: AIServiceProtocol {
    func generateImage(from request: ImageGenerationRequest) async throws -> UIImage {
        // Simulate network delay
        try await Task.sleep(nanoseconds: 2_000_000_000)
        
        // Return a simple test image
        let size = CGSize(width: 400, height: 400)
        let renderer = UIGraphicsImageRenderer(size: size)
        
        return renderer.image { context in
            let rect = CGRect(origin: .zero, size: size)
            
            // Background
            UIColor(red: 0.97, green: 0.95, blue: 0.89, alpha: 1.0).setFill()
            context.fill(rect)
            
            // Draw a simple robot
            let color = colorFromHex(request.colorHex)
            color.setFill()
            
            // Body
            let bodyRect = CGRect(x: 150, y: 200, width: 100, height: 120)
            context.cgContext.fillEllipse(in: bodyRect)
            
            // Head
            let headRect = CGRect(x: 160, y: 140, width: 80, height: 60)
            context.cgContext.fillEllipse(in: headRect)
            
            // Eyes
            UIColor.black.setFill()
            context.cgContext.fillEllipse(in: CGRect(x: 175, y: 155, width: 10, height: 10))
            context.cgContext.fillEllipse(in: CGRect(x: 215, y: 155, width: 10, height: 10))
        }
    }
    
    func validatePrompt(_ prompt: String) async throws -> Bool {
        return !prompt.isEmpty
    }
    
    private func colorFromHex(_ hex: String) -> UIColor {
        var hexString = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if hexString.hasPrefix("#") {
            hexString.removeFirst()
        }
        
        var rgb: UInt64 = 0
        Scanner(string: hexString).scanHexInt64(&rgb)
        
        return UIColor(
            red: CGFloat((rgb & 0xFF0000) >> 16) / 255.0,
            green: CGFloat((rgb & 0x00FF00) >> 8) / 255.0,
            blue: CGFloat(rgb & 0x0000FF) / 255.0,
            alpha: 1.0
        )
    }
} 

