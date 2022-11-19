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

const isInIntervals = (intervals, index) => {
    return intervals.some(interval => index <= interval[1] && index >= interval[0])
}

function TransparentCode({children, boilerplate}){
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
                    const isBoilerplate = isInIntervals(boilerplate, i); 
                    const highlightedLine = hljs.highlightAuto(rawLine).value;

                    const html =  isBoilerplate 
                        ? rawLine 
                        : addLink(highlightedLine);

                    return <tr 
                        value={`${i}`} key={i} 
                        className={isBoilerplate ? 'boilerplate' : null}
                    >
                        <td className="line-number">{i}</td>
                        {
                            isBoilerplate 
                            ? <td className="html-line">{html}</td>
                            : <td className="html-line" dangerouslySetInnerHTML={{__html: html}}></td>
                        }
                    </tr>
                })
               } 
            </tbody>
        </table>
    );
}


