'use strict';

const Sortable = require('sortablejs');
const tagsInput = require('tags-input');

/**
 * Methods
 */

window.admin_photoDeletable = (deletable) => {
    document.querySelectorAll("input.delete-photo").forEach((item) => {
        (deletable) ? item.removeAttribute('disabled') : item.setAttribute('disabled', 'disabled');
    });
}
var cmsEvent = new Event('CMS_load');

window.addEventListener('CMS_load', function() {
    // Sortable register

    document.querySelectorAll("[sortable=true]").forEach(function(element) {
        let original_list = {};
        element.querySelectorAll('.photo-container').forEach((item, index) => {
            original_list[item.dataset.photoId] = index + 1;
        });
        let sort = new Sortable(element, {
            draggable: element.dataset.draggable,
            onEnd(event) {
                let list = {};
                event.target.querySelectorAll('.photo-container').forEach((item, index) => {
                    list[item.dataset.photoId] = index + 1;
                });
                document.querySelectorAll(event.target.dataset.sortedField).forEach((item) => {
                    item.value = JSON.stringify([list, original_list]);
                })
            }
        })
    }, this);

    document.querySelectorAll('input[type=tags]').forEach( element => {
        tagsInput(element);
    });

});

window.addEventListener('load', () => {
    window.dispatchEvent(cmsEvent);
})