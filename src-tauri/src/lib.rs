use std::process::Command;

#[tauri::command]
fn get_host_name() -> String {
    if cfg!(target_os = "windows") {
        let output = Command::new("wmic")
            .args(["csproduct", "get", "UUID"])
            .output();

        if let Ok(output) = output {
            let uuid = String::from_utf8_lossy(&output.stdout);
            return uuid.lines().nth(1).unwrap_or("Unknown").trim().to_string();
        }
    } else {
        let output = Command::new("cat")
            .arg("/etc/machine-id")
            .output();

        if let Ok(output) = output {
            let uuid = String::from_utf8_lossy(&output.stdout);
            return uuid.trim().to_string();
        }
    }
    "Unknown".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![get_host_name])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
