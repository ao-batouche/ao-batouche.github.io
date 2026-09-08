// create element for copy button in code blocks
var codeBlocks = document.querySelectorAll('pre');
codeBlocks.forEach(function (codeBlock) {
  if (codeBlock.querySelector('pre:not(.lineno)') || codeBlock.querySelector('code')) {
    // create copy button
    var copyButton = document.createElement('button');
    copyButton.className = 'copy';
    copyButton.type = 'button';
    copyButton.ariaLabel = 'Copy code to clipboard';
    copyButton.innerText = 'Copy';
    copyButton.innerHTML = '<i class="fa-solid fa-clipboard"></i>';

    // get code from code block and copy to clipboard
    copyButton.addEventListener('click', async function () {
      // check if code block has line numbers
      // i.e. `kramdown.syntax_highlighter_opts.block.line_numbers` set to true in _config.yml
      // or using `jekyll highlight` liquid tag with `linenos` option
      if (codeBlock.querySelector('pre:not(.lineno)')) {
        // get code from code block ignoring line numbers
        var code = codeBlock.querySelector('pre:not(.lineno)').innerText.trim();
      } else { // if (codeBlock.querySelector('code')) {
        // get code from code block when line numbers are not displayed
        var code = codeBlock.querySelector('code').innerText.trim();
      }
      try {
        await window.navigator.clipboard.writeText(code);
      } catch (_) {
        copyButton.textContent = 'Select code';
        copyButton.setAttribute('aria-label', 'Clipboard unavailable; select and copy the code');
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(codeBlock);
        selection.removeAllRanges();
        selection.addRange(range);
        return;
      }
      copyButton.setAttribute('aria-label', 'Copied to clipboard');
      copyButton.innerText = 'Copied';
      copyButton.innerHTML = '<i class="fa-solid fa-clipboard-check"></i>';
      var waitFor = 3000;

      setTimeout(function () {
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        copyButton.innerText = 'Copy';
        copyButton.innerHTML = '<i class="fa-solid fa-clipboard"></i>';
      }, waitFor);
    });

    // create wrapper div
    var wrapper = document.createElement('div');
    wrapper.className = 'code-display-wrapper';

    // add copy button and code block to wrapper div
    const parent = codeBlock.parentElement;
    parent.insertBefore(wrapper, codeBlock);
    wrapper.append(codeBlock);
    wrapper.append(copyButton);
  }
});
