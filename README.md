# After Effects Typewriter
A [custom script](https://helpx.adobe.com/after-effects/using/scripts.html#:~:text=You%20can%20write%20your%20own,and%20testing%20your%20own%20scripts.) for Adobe After Effects to be used with text in animations.

## Settings
![Settings](/images/typewriterdemo.png)

* **Characters/Second**: The rate at which each character will be revealed. Can be changed with the slider or entered into the value box.
* **Pause Duration**: How long the animation will pause once a punctuation mark is reached. Can be changed with the slider or entered into the value box.
* **Punctuation**: the list of characters that count as punctuation. Can be changed by editing the input field.

## Instructions
1. Add an opacity animator to your text layer ![Step 1](/images/addAnimateStep.png)
   
3. Open the Range Selector and the advanced tab and change these settings ![Step 2](/images/animateSettingsStep.png)
    * Change `Units` from `Percentage` to `Index`
    * If you want spaces to be skipped, set change `Based On` from `Characters` to `Characters Excluding Spaces`
    * If you want the characters to pop in, set `Smoothness` to 0%, if you want them to fade in, keep it at 100% (or your desired smoothness)
    * Set the `Opacity` setting to 0%
4. Click on the `Text` component to have it selected, make sure it is highlighted or the script won't create the animation ![Highlight](/images/highlightStep.png)
   
6. Open up the Typewriter window and click Generate Keyframes! Open up the graph editor and the result should look something like this ![Curves](/images/curves.png)

![Demo](/images/result.gif)
      
