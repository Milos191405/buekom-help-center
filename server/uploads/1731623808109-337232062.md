---
tags:
  - windows
  - win11
  - desktop
  - registry
---
Starting with [**Windows 11 build 22635.3785**](https://www.elevenforum.com/t/kb5039319-windows-11-insider-beta-build-22635-3785-23h2-june-14.26051/) (Beta), Microsoft is trying out some new adjustments to the Windows Spotlight experience on the desktop to make it easier for Spotlight users to engage with this feature to change images, like or not like an image etc. There will be several changes that Insiders will notice.  

- Treatment #1 – if a user right-clicks on the Windows Spotlight icon it will launch the Spotlight experience in full screen mode, while double-clicking will open the Bing landing page for the image on desktop.
- Treatment #2 – if a user right-clicks on the Windows Spotlight icon it will launch the Spotlight experience, while double-clicking will open Windows Spotlight experience in full screen mode. A single click on the Spotlight icon will open the Bing landing page for the image on desktop.

  
**EXAMPLE: Windows Spotlight "Learn more about this picture" desktop icon**  
  

![Windows_Spotlight_learn_about_this_picture-1.jpg](https://www.elevenforum.com/attachments/windows_spotlight_learn_about_this_picture-1-jpg.65283/ "Windows_Spotlight_learn_about_this_picture-1.jpg")

 

![Windows_Spotlight_learn_about_this_picture-2.jpg](https://www.elevenforum.com/attachments/windows_spotlight_learn_about_this_picture-2-jpg.65284/ "Windows_Spotlight_learn_about_this_picture-2.jpg")

  
  
  
**Here's How:**  
  
1 Do [**step 2**](https://www.elevenforum.com/t/add-or-remove-learn-more-about-this-picture-desktop-icon-in-windows-11.7137/#2) (add) or [**step 3**](https://www.elevenforum.com/t/add-or-remove-learn-more-about-this-picture-desktop-icon-in-windows-11.7137/#3) (remove) below for what you would like to do.  
  

2 Add "Learn more about this picture" Desktop icon

  

This is the default setting.  
  
The "Learn more about this picture" desktop icon will only show when using **Windows Spotlight** as your [**desktop background**](https://www.elevenforum.com/t/change-desktop-background-to-spotlight-picture-solid-color-or-slideshow-in-windows-11.909/).

  

A) Click/tap on the Download button below to download the file below, and go to [**step 4**](https://www.elevenforum.com/t/add-or-remove-learn-more-about-this-picture-desktop-icon-in-windows-11.7137/#step4) below.​

  

**Add_Learn_about_this_picture_desktop_icon.reg**​

  

 [Download](https://www.elevenforum.com/attachments/add_learn_about_this_picture_desktop_icon-reg.31679/?hash=32e25978fc0b69c77147d77bb1b39ee5)​

  
(Contents of REG file for reference)  

Code:

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\HideDesktopIcons\NewStartPanel]
"{2cc5ca98-6485-489a-920e-b3e88a6ccce3}"=dword:00000000
```

  

3 Remove "Learn more about this picture" Desktop icon

  

A) Click/tap on the Download button below to download the file below, and go to [**step 4**](https://www.elevenforum.com/t/add-or-remove-learn-more-about-this-picture-desktop-icon-in-windows-11.7137/#step4) below.​

  

**Remove_Learn_about_this_picture_desktop_icon.reg**​

  

 [Download](https://www.elevenforum.com/attachments/remove_learn_about_this_picture_desktop_icon-reg.31680/?hash=32e25978fc0b69c77147d77bb1b39ee5)​

  
(Contents of REG file for reference)  

Code:

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\HideDesktopIcons\NewStartPanel]
"{2cc5ca98-6485-489a-920e-b3e88a6ccce3}"=dword:00000001
```

  
4 Save the .reg file to your desktop.  
  
5 Double click/tap on the downloaded .reg file to merge it.  
  
6 When prompted, click/tap on **Run**, **Yes** ([**UAC**](https://www.elevenforum.com/t/change-user-account-control-uac-settings-in-windows-11.1523/)), **Yes**, and **OK** to approve the merge.  
  
7 Right click on your desktop, and click/tap on **Refresh** (F5) your desktop to apply.  
  
8 You can now delete the downloaded .reg file if you like.  
  
  
That's it,  
Shawn Brink