import SwiftUI

// Generation Progress View
struct GenerationProgressView: View {
    @ObservedObject var viewModel: CreationViewModel
    @State private var rotationAngle: Double = 0
    @State private var scale: CGFloat = 1.0
    
    var body: some View {
        VStack(spacing: 30) {
            Spacer()
            
            // Loading Animation
            loadingAnimation
            
            // Encouraging Message
            Text(viewModel.currentMessage)
                .font(.title3)
                .fontWeight(.medium)
                .multilineTextAlignment(.center)
                .foregroundColor(.black)
                .animation(.easeInOut(duration: 0.5), value: viewModel.currentMessage)
                .padding(.horizontal, 40)
            
            // Progress Bar
            progressBar
            
            Spacer()
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
    
    // Loading Animation
    private var loadingAnimation: some View {
        ZStack {
            Circle()
                .stroke(
                    LinearGradient(
                        colors: [Color.white.opacity(0.3), Color.white],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ),
                    lineWidth: 4
                )
                .frame(width: 120, height: 120)
                .rotationEffect(.degrees(rotationAngle))
                .animation(
                    Animation.linear(duration: 2)
                        .repeatForever(autoreverses: false),
                    value: rotationAngle
                )
            
            // Android bot center icon
            VStack(spacing: 2) {
                // Antenna
                HStack(spacing: 16) {
                    Rectangle()
                        .fill(Color.white)
                        .frame(width: 2, height: 8)
                        .cornerRadius(1)
                    Rectangle()
                        .fill(Color.white)
                        .frame(width: 2, height: 8)
                        .cornerRadius(1)
                }
                
                // Head
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.white)
                    .frame(width: 35, height: 25)
                    .overlay(
                        HStack(spacing: 8) {
                            Circle()
                                .fill(Color.black)
                                .frame(width: 3, height: 3)
                            Circle()
                                .fill(Color.black)
                                .frame(width: 3, height: 3)
                        }
                    )
                
                // Body
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.white)
                    .frame(width: 30, height: 35)
            }
            .scaleEffect(scale)
            .animation(
                Animation.easeInOut(duration: 1.5)
                    .repeatForever(autoreverses: true),
                value: scale
            )
        }
        .onAppear {
            rotationAngle = 360
            scale = 1.1
        }
    }
    
    // Progress Bar
    private var progressBar: some View {
        VStack(spacing: 12) {
            HStack {
                Text("Generating your bot...")
                    .font(.caption)
                    .foregroundColor(.black.opacity(0.7))
                Spacer()
                Text("\(Int(viewModel.currentProgress * 100))%")
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundColor(.black)
            }
            
            // Progress bar background
            RoundedRectangle(cornerRadius: 6)
                .fill(Color.white.opacity(0.3))
                .frame(height: 8)
                .overlay(
                    // Progress bar fill
                    HStack {
                        RoundedRectangle(cornerRadius: 6)
                            .fill(
                                LinearGradient(
                                    colors: [Color.white, Color.white.opacity(0.8)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .frame(width: max(8, CGFloat(viewModel.currentProgress) * 280))
                            .animation(.easeInOut(duration: 0.3), value: viewModel.currentProgress)
                        Spacer(minLength: 0)
                    }
                )
        }
        .padding(.horizontal, 40)
    }
}

// Preview
struct GenerationProgressView_Previews: PreviewProvider {
    static var previews: some View {
        // Create a test view model
        let mockAIService = MockAIService()
        let testViewModel = CreationViewModel(aiService: mockAIService)
        
        return GenerationProgressView(viewModel: testViewModel)
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
