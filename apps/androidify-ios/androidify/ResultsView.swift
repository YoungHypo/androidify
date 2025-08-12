import SwiftUI

// Results View
struct ResultsView: View {
    @ObservedObject var viewModel: CreationViewModel
    let generatedImage: UIImage
    @State private var selectedInputType: InputType = .bot
    @State private var imageScale: CGFloat = 0.8
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Header
                headerView
                
                // Main Content
                ScrollView {
                    VStack(spacing: 20) {
                        // Toggle Buttons (Prompt/Bot)
                        toggleSelectionView
                        
                        // Generated Image or Description
                        if selectedInputType == .bot {
                            imageDisplaySection
                        } else {
                            descriptionSection
                        }
                        
                        Spacer()
                        
                        // Action Buttons
                        actionButtons
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
        .onAppear {
            withAnimation(.spring(response: 0.8, dampingFraction: 0.6)) {
                imageScale = 1.0
            }
        }
    }
    
    // Header View
    private var headerView: some View {
        HStack {
            Button(action: {
                viewModel.resetToEditingMode()
            }) {
                Image(systemName: "chevron.left")
                    .font(.title2)
                    .foregroundColor(.black)
            }
            
            Spacer()
            
            Text("Androidify")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(.black)
            
            Spacer()
            
            Button(action: {
                // Info action
            }) {
                Image(systemName: "info.circle")
                    .font(.title2)
                    .foregroundColor(.black)
            }
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
            
            // Bot option  
            Button("Bot") {
                selectedInputType = .bot
            }
            .foregroundColor(selectedInputType == .bot ? .white : .black)
            .font(.headline)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 12)
            .background(
                selectedInputType == .bot ? Color.black : Color.clear
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
    
    // Image Display Section
    private var imageDisplaySection: some View {
        VStack(spacing: 20) {
            // Generated Image
            Image(uiImage: generatedImage)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(maxWidth: 300, maxHeight: 400)
                .clipShape(RoundedRectangle(cornerRadius: 16))
                .scaleEffect(imageScale)
                .shadow(color: .black.opacity(0.15), radius: 10, x: 0, y: 5)
                .animation(.spring(response: 0.6, dampingFraction: 0.8), value: imageScale)
                .padding(.horizontal, 20)
        }
    }
    
    // Description Section
    private var descriptionSection: some View {
        VStack(alignment: .leading, spacing: 16) {
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
            
            // Description Text
            Text(viewModel.description)
                .font(.body)
                .foregroundColor(.black)
                .padding(20)
                .background(
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.white.opacity(0.8))
                        .shadow(color: .black.opacity(0.1), radius: 5, x: 0, y: 2)
                )
        }
        .padding(.horizontal, 20)
    }
    
    // Action Buttons
    private var actionButtons: some View {
        HStack(spacing: 16) {
            Button(action: {
            }) {
                HStack(spacing: 8) {
                    Image(systemName: "square.and.arrow.up")
                        .font(.system(size: 16, weight: .semibold))
                    Text("Share your bot")
                }
                .foregroundColor(.white)
                .font(.system(size: 16, weight: .semibold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
                .background(Color.black)
                .cornerRadius(25)
                .shadow(color: .black.opacity(0.3), radius: 4, x: 0, y: 2)
            }
            
            // Download Button  
            Button(action: {
            }) {
                Image(systemName: "arrow.down")
                    .font(.system(size: 20, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(width: 56, height: 56)
                    .background(Color.black)
                    .clipShape(Circle())
                    .shadow(color: .black.opacity(0.3), radius: 4, x: 0, y: 2)
            }
        }
        .padding(.horizontal, 20)
    }
}

// Input Type Extension
extension InputType {
    static let bot: InputType = .photo // Reuse photo enum value to represent bot
}

// Preview
struct ResultsView_Previews: PreviewProvider {
    static var previews: some View {
        let mockImage = UIImage(systemName: "android") ?? UIImage()
        
        // Create a mock AI service for testing
        let mockAIService = MockAIService()
        
        ResultsView(
            viewModel: CreationViewModel(aiService: mockAIService),
            generatedImage: mockImage
        )
    }
}

// Mock AI Service for Previews
private class MockAIService: AIServiceProtocol {
    func generateImage(from request: ImageGenerationRequest) async throws -> UIImage {
        // Return a test image
        return UIImage(systemName: "android") ?? UIImage()
    }
    
    func validatePrompt(_ prompt: String) async throws -> Bool {
        return true
    }
} 
