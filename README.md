# Before we start I want to make one thing clear.This is for EDUCATIONAL PURPOSES only and I am NOT responsible for any damages caused.


# Bedrock Learning Gemini Solver

A Tampermonkey script that captures a screenshot of Bedrock Learning questions, sends it to Google's Gemini API, and displays the answer in a beautifully styled new tab.


---

## Features

- **Screenshot Capture**: Automatically captures the entire webpage.
- **Gemini API Integration**: Sends the screenshot to Google's Gemini API for analysis.
- **Customizable Prompt**: Allows users to provide additional instructions or use the default prompt.
- **Stylish Answer Display**: Displays the answer in a new tab with a modern, animated background.
- **Copy to Clipboard**: Easily copy the answer to your clipboard with one click.

---

## Prerequisites

1. **Tampermonkey Extension**:
   - Install the [Tampermonkey extension](https://www.tampermonkey.net/) for your browser (Chrome, Firefox, Edge, etc.).

2. **Google Gemini API Key**:
   - Obtain an API key from [Google AI Studio](https://makersuite.google.com/).
   - The script will prompt you to enter your API key the first time you use it.

---

## Installation

1. **Copy the Script**:
   - Copy the script from the [GitHub repository](https://github.com/your-username/your-repo) or the raw script file.

2. **Create a New Script in Tampermonkey**:
   - Open the Tampermonkey dashboard.
   - Click on **Create a new script**.

3. **Paste the Script**:
   - Delete the default template and paste the copied script into the editor.

4. **Save the Script**:
   - Click **File > Save** or press `Ctrl + S` to save the script.

5. **Enable the Script**:
   - Ensure the script is enabled in the Tampermonkey dashboard.

---

## Usage

1. **Navigate to Bedrock Learning**:
   - Go to the Bedrock Learning website and log in to your account.

2. **Trigger the Script**:
   - Press `Ctrl + X` on any Bedrock Learning page.
   - The script will capture a screenshot and prompt you for additional instructions (optional).

3. **View the Answer**:
   - The script will open a new tab with the answer displayed in a stylish interface.
   - You can copy the answer to your clipboard by clicking the **📋 Copy** button.

---

## Customization

### Default Prompt
The script uses the following default prompt for Gemini:

You can modify this prompt in the script by editing the `DEFAULT_PROMPT` constant.

### Background Animation
The script includes a dynamic background that transitions between blue, green, and pink. You can customize the colors and animation speed by editing the `@keyframes hueShift` section in the CSS.

---

## Troubleshooting

### API Key Not Working
- Ensure you have entered a valid Gemini API key.
- If the key is incorrect, the script will display an error message.

### Screenshot Issues
- If the screenshot is not capturing the entire page, adjust the `html2canvas` settings in the script.

### Script Not Working
- Ensure the script is enabled in Tampermonkey.
- Check the browser console for errors (press `F12` and go to the **Console** tab).

---

## Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeatureName`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeatureName`).
5. Open a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [Tampermonkey](https://www.tampermonkey.net/) for providing the userscript manager.
- [Google Gemini API](https://developers.generativeai.google/) for the AI capabilities.
- [html2canvas](https://html2canvas.hertzen.com/) for the screenshot functionality.

---

## Support

If you find this project helpful, consider giving it a ⭐️ on GitHub!
