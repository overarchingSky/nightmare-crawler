div = document.createElement('div')
div.className = 'newbox'
div.innerText = 'new box!'
div.style = 'width:100px;height:100px;background-color:green;'
div.addEventListener('click', function() { alert('我被点击了') })
document.body.appendChild(div)