const URL_REGEX = /(((https?:\/\/)|mailto:)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?//=]*))/

function addLink (line){
    return line.replace(URL_REGEX, '<a href="$1" target="_blank">$1</a>')
}

function loadCssFile(version){
    let previousThemeCSS = document.querySelector('#css-theme')
    if(previousThemeCSS){
        previousThemeCSS.remove();
    }
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id = 'css-theme'
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = version;
    link.media = 'all';
    head.appendChild(link);
}

const switchCSS = {
    't/css/light.css': 't/css/dark.css',
    't/css/dark.css': 't/css/light.css',
}

function switchTheme(){
    let xpath = `//*[text()='"t/css/light.css"']`;
    var cssPathElement = document.evaluate(xpath, document).iterateNext();
    if(!cssPathElement){
        return;
    }
    cssPathElement.parentNode.style.cursor = 'pointer';
    cssPathElement.parentNode.addEventListener('click', () => {
        let newCss = switchCSS[cssPathElement.innerHTML.replace(/"/g, '')];
        loadCssFile(newCss);
        cssPathElement.innerHTML = `"${newCss}"`;
    });
}


function TransparentCode({children, interactiveLines=[]}){
    const [pageContent, setContent] = React.useState('');

    const fetchData = React.useCallback(() => {
        fetch(document.location.href)
        .then(res => res.text())
        .then(data => setContent(data));
    });
    
    React.useEffect(() => {
        document.onkeydown = function(evt) {
            evt = evt || window.event;
            console.log(evt.key)
        };
    });

    React.useLayoutEffect(() => {
        switchTheme();
    });

    React.useEffect(() => {
        fetchData();
    }, []);

    const lines = pageContent.split('\n')
    .filter(l => !l.startsWith('//# sourceMappingURL'));

    return (
        <table>
            <tbody>
               {
                lines.map((rawLine, i) => {
                    const highlightedLine = hljs.highlightAuto(rawLine).value;
                    const html = i <= interactiveLines[1] && i >= interactiveLines[0] 
                        ? addLink(highlightedLine)
                        : highlightedLine
                    return <tr value={`${i}`} key={i}>
                        <td className="line-number">{i}</td>
                        <td className="html-line" dangerouslySetInnerHTML={{__html: html}}></td>
                    </tr>
                })
               } 
            </tbody>
        </table>
    );
}


