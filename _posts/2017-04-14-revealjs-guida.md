---
layout: post
title:  "Reveal.js, guida all'utilizzo"
date:   2017-04-14
excerpt: "Un framework per le presentazioni in HTML"
tag:
- javascript
- HTML5
comments: true
---
L'altro giorno, cercando un modo di creare una presentazione per il [mio ultimo progetto]({{ site.url }}/meshweather) mi sono imbattuto un framework completo e di semplice utilizzo. Un esempio di cosa si può fare con questo gioiellino in soli 5 minuti è questo:
<iframe src="https://apagiaro.it/mesh" height="450px" width="700px"></iframe>

## Let's start
Per iniziare ci basterà scaricare il codice del framework dalla [sua pagina GitHub](https://github.com/hakimel/reveal.js). A questo punto possiamo iniziare subito modificando la pagina ``index.html`` o creando la nostra nuova pagina fatta che dovrà includere nell'``head`` le seguenti dichiarazioni:
```html
<link rel="stylesheet" href="css/reveal.css">
<link rel="stylesheet" href="css/theme/moon.css">
```
e in fondo alla pagina, prima della chiusura del ``</body>``, bisognerà aggiungere del codice Javascript per il caricamento del framework:
```javascript
<script src="lib/js/head.min.js"></script>
<script src="js/reveal.js"></script>

<script>
	// More info https://github.com/hakimel/reveal.js#configuration
	Reveal.initialize({
		history: true,

		// More info https://github.com/hakimel/reveal.js#dependencies
		dependencies: [
			{ src: 'plugin/markdown/marked.js' },
			{ src: 'plugin/markdown/markdown.js' },
			{ src: 'plugin/notes/notes.js', async: true },
			{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } }
		]
	});
</script>
```
dove le dependencies possono essere modificate a vostro piacimento. Le configazioni applicabili sono tantissime e avremo modo più avanti di parlarne.

### Creare le slides
Fatto questo non dobbiamo far altro che iniziare a scrivere la nostra presentazione. Ogni slide non è altro che una pagina HTML racchiusa tra i tag ``<section>``. Tutte le ``<section>`` vanno aggiunte tra i seguenti div
```html
<div class="reveal">
	<div class="slides">
	...
	</div>
</div>
```
La particolarità di questo framework è la possibilità di aggiungere sia uno scorrimento orizzontale, utilizzato, di solito, per rappresentare il cambio di macroargomento, sia uno scorrimento verticale che è più simile ad uno scorrimento classico di slides. Per aggiungere quindi uno scorrimento verticale basterà aggiungere ``<section>`` annidate. Un codice come
```html
<section>
	<section>
		Slide 1.1
	</section>
	<section>
		Slide 1.2
	</section>
</section>
<section>
	<section>
		Slide 2.1
	</section>
	<section>
		Slide 2.2
	</section>
</section>
```
produrrà il seguente risultato:
<iframe src="{{ site.url }}/revealjs/esempio1.html" height="450px" width="700px"></iframe>

### Frammenti
Per far apparire i punti di un'elenco uno alla volta alla pressione del tasto avanti o mostrare una didascalia dopo un'immagine è una cosa che si può fare senza fatica. Basta aggiungere, all'oggetto che vogliamo mostrare dopo, la classe ``fragment``. Un esempio è il seguente codice:
```html
<section>
	<ul>
		<li class="fragment"> Punto 1 </li>
		<li class="fragment"> Punto 2 </li>
		<li class="fragment"> Punto 3 </li>
	</ul>
</section>
<section>
	Applicare diversi stili ai fragment...
	<ul>
		<li class="fragment grow"> class="fragment grow" </li>
		<li class="fragment shrink"> class="fragment shrink" </li>
		<li class="fragment fade-out"> class="fragment fade-out" </li>
		<li class="fragment fade-up highlight-red"> class="fragment fade-out highlight-red" </li>
	</ul>
</section>
``` 
che produce il seguente risultato
<iframe src="{{ site.url }}/revealjs/esempio2.html" height="450px" width="700px"></iframe>


## Temi
Questo framework contiene anche numerosi temi che possono essere applicati semplicemente cambiato il css importanto nell'header della pagina. A [questa pagina]({{ site.url }}/revealjs/theme_example.html) potete trovare un'anteprima dei temi disponibili nella repository del framework su GitHub.



