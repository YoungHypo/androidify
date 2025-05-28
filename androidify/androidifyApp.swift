//
//  androidifyApp.swift
//  androidify
//
//  Created by YoungHypo on 5/27/25.
//

import SwiftUI
import FirebaseCore
import FirebaseAppCheck
import FirebaseAppCheckInterop

class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication,
                   didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    
    #if DEBUG
    let providerFactory = AppCheckDebugProviderFactory()
    AppCheck.setAppCheckProviderFactory(providerFactory)
    #endif
    
    FirebaseApp.configure()

    return true
  }
}

@main
struct androidifyApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
