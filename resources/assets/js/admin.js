Sortable = require('sortablejs');

window.addEventListener('load', function() {
    // Sortable register

    document.querySelectorAll("[sortable=true]").forEach(function(element) {
        let sort = new Sortable(element, {
            draggable: element.dataset.draggable,
            onEnd(event) {
                let list = {};
                event.target.querySelectorAll('.photo-container').forEach((item, index) => {
                    list[item.dataset.photoId] = index + 1;
                });
                document.querySelectorAll(event.target.dataset.sortedField).forEach((item) => {
                    item.value = JSON.stringify(list);
                })
            }
        })
    }, this);

});