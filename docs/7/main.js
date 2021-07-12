window.addEventListener('load', (event) => {
    var documents = [
    {
    id: 0,
    title: "Oracle released its latest database Oracle 12g",
    body: "Yestaday Oracle has released its new database Oracle 12g, this would make more money for this company and lead to a nice profit report of annual year."
    },
    {
    id: 1,
    title: "Oracle released its profit report of 2015",
    body: "As expected, Oracle released its profit report of 2015, during the good sales of database and hardware, Oracle's profit of 2015 reached 12.5 Billion."
    },
    {
    id: 2,
    title: "Some Title",
    body: "Some Body"
    },
    {
    id: 3,
    title: "日本語とEnglishが混在した文章です。",
    body: "本文です。和文と英文がmixしています。"
    },
    {
    id: 4,
    title: "タイトルmix",
    body: "本文。和文。"
    },
    {
    id: 5,
    title: "日本語とJapaneseが混在した文章です。",
    body: "本文です。和文と英文がmixしています。"
    },
    ];
    require(['lib/elasticlunr/elasticlunr.0.9.6.min.js', 
             'lib/elasticlunr/lunr-languages/tinyseg.js', 
             'lib/elasticlunr/lunr-languages/min/lunr.stemmer.support.min.js', 
             'lib/elasticlunr/lunr-languages/lunr.multi.js', 
             'lib/elasticlunr/lunr-languages/lunr.ja.js'
            ], function(elasticlunr, tinyseg, stemmerSupport, multi, ja) {
        stemmerSupport(lunr);
        tinyseg(lunr);
        ja(lunr);
        multi(lunr);
        var index = elasticlunr(function() {
            this.use(elasticlunr.ja);
//            this.use(elasticlunr.multiLanguage('en', 'ja'));
            this.setRef('id');
            this.addField('title');
            this.addField('body');
            this.saveDocument(false);
            for (const doc of documents) { this.addDoc(doc); }
        });

        function createAllDocumentDom() {
            const result = document.querySelector('#SearchResult');
            console.log(result)
            for (const doc of documents) {
                result.appendChild(createDocumentDom(doc))
            }
        }
        function createDocumentDom(doc) {
            var details = document.createElement('details');
            var summary = document.createElement('summary');
            summary.appendChild(document.createTextNode(doc.title))
            details.appendChild(summary)
            details.appendChild(document.createTextNode(doc.body))
            return details
        }
        createAllDocumentDom()
        function createSearchResultDom(keyword) {
            if ('' == keyword) { createAllDocumentDom(); return; }
            const dom = document.querySelector('#SearchResult');
            while (dom.firstChild) { dom.removeChild(dom.firstChild); }
            result = index.search(keyword, {
//            result = index.search(`*${keyword}*`, { // 部分一致検索にすることでムリヤリ英語混在でも検索できるようにする
                fields: {
                    title: {boost: 2, bool: 'AND'},
                    body: {boost: 1, bool: 'AND'}
                }, bool: 'OR'
            });
            console.log(result);
            for (const res of result) {
                dom.appendChild(createDocumentDom(documents.find(doc => doc.id == res.ref)))
            }
        }
        const input = document.querySelector('input[type="search"]');
        input.addEventListener('input', () => {
            createSearchResultDom(input.value)
        });
        input.focus()
        input.selectionStart = input.selectionEnd = input.value.length;
        createSearchResultDom(input.value)
   });
});
