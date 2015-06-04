var lunr = require('lunr');

module.exports = {

    initialLunrJobsIndex: function() {
        return lunr(function () {
            this.field('title', { boost: 10 });
            this.field('location', { boost: 5 });
            this.field('content');
        });
    },

    mapGreenhouseJob: function(greenhouseJob) {
        function unescapeHtml(string) {
            var entityMap = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"'
            };

            return String(string).replace(/(&amp;|&lt;|&gt;|&quot;)/g, function fromEntityMap (s) {
                return entityMap[s];
            });
        }

        function stripHtmlTags(string) {
            var strip = [
                '<h1>','</h1>',
                '<h2>','</h2>',
                '<p>','</p>',
                '<ul>','</ul>',
                '<ol>','</ol>',
                '<li>','</li>',
                '&rsquo;',
                '&amp;',
                '&mdash;',
                'mailto:'
            ]
            return String(string)
                .replace(new RegExp(strip.join('|'),'g'), '');
        }

        return {
            "id": greenhouseJob.id,
            "title": greenhouseJob.title,
            "location": greenhouseJob.location.name,
            "content": stripHtmlTags(unescapeHtml(greenhouseJob.content))
        }
    }
}
