---
title: How to convert numbers in word to ordinary words, how to convert WORD numbers to ordinary text
subtitle: How to convert numbers in word to ordinary words, how to convert WORD numbers to ordinary text
date: 2021-12-16 13:16:15
toc: true
tags: 
categories: 
    - Default
---

## How to Remove Automatic Numbering Format in Word While Retaining Original Numbered Content:

1. Access the "Developer" Tab in Word

   Open File -> Options -> Customize Ribbon -> Check "Developer" -> OK

   ![Insert Image Description Here](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/99bda1d4889d88663775466590df1445.png)

2. Write a Macro

   Click on Developer -> Macros -> In the "Macro name" field, enter a macro name (e.g., NumToTxt) -> Click "Create." This will open the Visual Basic editor window, where you should see the following code:

   Copy and paste the following code:
   ```vb
   ActiveDocument.Content.ListFormat.ConvertNumbersToText
   ```

   Paste this code in front of "End Sub" in the editor window. Finally, click the save button in the Visual Basic editor to save the macro to the Normal template, then close the VBA window and return to Word.

   Editor window content:

   ![Insert Image Description Here](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/9f9edbfd72bef556c4edaad5727a61a6.png)

3. Use the Macro

   Open the Word document you want to process. Click on Tools -> Macros -> Select the "NumToTxt" macro that we created earlier (the macro name should be displayed in the "Macro name" field) -> Run the macro. This will automatically remove the numbering format.

   ![Insert Image Description Here](https://raw.githubusercontent.com/james-curtis/james-curtis.github.io/static/images/9fdc7987e2e65dfb6e60ac862c8a96bf.png)

Original article link: [How to Convert Word Numbering to Plain Text](https://blog.csdn.net/hevin_hy/article/details/107568487)