// Max Cohn
// function to generate the table using simple logic
const MAX_ELEMENTS = 100 * 100;
function Generate(id) {
    const table = document.getElementById(id);
    table.innerHTML = "";
    // get values from the inputs
    const minCol = parseInt(document.getElementById('minCol').value);
    const maxCol = parseInt(document.getElementById('maxCol').value);
    const minRow = parseInt(document.getElementById('minRow').value);
    const maxRow = parseInt(document.getElementById('maxRow').value);
    // validate input
    if (isNaN(minCol) || isNaN(maxCol) || isNaN(minRow) || isNaN(maxRow)) {
        table.insertRow().insertCell().textContent = 'Invalid input';
        return;
    }
    // avoid freezing by limiting max number of elements
    if (((maxRow - minRow) * (maxCol - minCol)) > MAX_ELEMENTS) {
        table.insertRow().insertCell().textContent = 'Table would be too large, must have less than ' + MAX_ELEMENTS + ' cells.';
        return;
    }
    const firstRow = table.insertRow();
    // top corner element
    firstRow.insertCell();
    // add top row header
    for (let i = minCol; i <= maxCol; i++) {
        const heading = document.createElement('th');
        heading.textContent = i;
        heading.className = 'header-top';
        firstRow.appendChild(heading);
    }
    for (let i = minRow; i <= maxRow; i++) {
        const row = table.insertRow();
        // add left side header
        const heading = document.createElement('th');
        heading.textContent = i;
        heading.className = 'header-side';
        row.appendChild(heading);
        // add cells
        for (let j = minCol; j <= maxCol; j++) {
            const cell = row.insertCell();
            cell.textContent = i * j;
        }
    }
    // do input validation after generating
    $('#input-form').valid();
}

$(function () {
    $('#input-form').validate({
        // places the error as the last thing in that table row
        errorPlacement: function(error, element) {
            const $closestRow = element.closest('tr');
            const $lastTd = $closestRow.find('td:last');
            error.appendTo($lastTd);
        },
        // found online to validate even on first pass
        onkeyup: function(element) {
            this.element(element);
            Generate('results');
            $(element).siblings('.slider').slider('option', 'value', $(element).val());
            $('#tab-window').tabs('option', 'active', 0);
        },
        rules: {
            minCol: {
                required: true,
                number: true,
                range: [-50, 50],
                // IsValidSize: true,
            },
            maxCol: {
                required: true,
                number: true,
                range: [-50, 50],
                // IsValidSize: true,
            },
            minRow: {
                required: true,
                number: true,
                range: [-50, 50],
                // IsValidSize: true,
            },
            maxRow: {
                required: true,
                number: true,
                range: [-50, 50],
                // IsValidSize: true,
            },
        },
        messages: {
            minCol: {
                number: 'Input must be a number',
                range: 'Please keep input between -50 and 50, (This is specific to part two)',
                // IsValidSize: 'Column range would result in a table too large',
            },
            maxCol: {
                number: 'Input must be a number',
                range: 'Please keep input between -50 and 50, (This is specific to part two)',
                // IsValidSize: 'Column range would result in a table too large',
            },
            minRow: {
                number: 'Input must be a number',
                range: 'Please keep input between -50 and 50, (This is specific to part two)',
                // IsValidSize: 'Row range would result in a table too large',
            },
            maxRow: {
                number: 'Input must be a number',
                range: 'Please keep input between -50 and 50, (This is specific to part two)',
                // IsValidSize: 'Row range would result in a table too large',
            },
        },
    });
    Generate('results');

    $('.slider').slider({
        min: -50,
        max: 50,
        step: 1,
        slide: function() {
            $(this).siblings('input').val($(this).slider('value'));
            Generate('results');
            $('#tab-window').tabs('option', 'active', 0);
        }
    });
    // set the sliders to the default values of the input boxes
    const sliders = $('.slider');
    sliders.each(function () {
        $(this).slider('option', 'value', $(this).siblings('input').val());
    });
    $('#tab-window').tabs();

    $('#save-button').on('click', function()  { SaveCurrentTab() });
    $('#delete-current-button').on('click', function() { DeleteCurrentTab() });
    $('#delete-selected-button').on('click', function() { DeleteSelectedTabs() });
});



// Tab handling
function SaveCurrentTab() {
    const tableName = PullTableName();
    const tabWindow = $('#tab-window');
    const tabList = $('#tab-window ul');
    const tabAlreadyExists = TabExists('#tab-window', tableName);
    if (tabAlreadyExists[0]) {
        tabWindow.tabs('option', 'active', tabAlreadyExists[1]);
        return;
    }
    AddTab(tabWindow, tabList, tableName);
}

function DeleteCurrentTab() {
    const tabWindow = $('#tab-window');
    const selectedIndex = $('#tab-window').tabs('option', 'active');
    if (selectedIndex != 0) {
        const $currentTab = tabWindow.find('.ui-tabs-nav li').eq(selectedIndex);
        const currentDiv = $currentTab.find('a').attr('href');
        $currentTab.remove();
        $(currentDiv).remove();
    }
    tabWindow.tabs('refresh');
}

function DeleteSelectedTabs() {
    const selectedList = $('ul li input');
    selectedList.each(function() {
        if ($(this).is(':checked')) {
            console.log(this);
            const selectedTab = $(this).parent();
            const currentDiv = selectedTab.find('a').attr('href');
            $(selectedTab).remove();
            $(currentDiv).remove();
        }
    });
    $('#tab-window').tabs('option', 'active', 0);
}

function AddTab(window, list, name) {
    const liveOutputHtml= $('#output').html();
    let idToSave = name;
    let newTab = $('<li><a href="#' + idToSave + '">' + idToSave + '</a>');
    let newWindow = $('<div class="container" id="' + idToSave + '">'+ liveOutputHtml +'</div>');
    list.append(newTab);
    $('#tab-window #control-panel').before(newWindow);
    newTab.children('a').each(function() { AddCheckBox(this) })
    window.tabs('refresh');
    window.tabs('option', 'active', $('#tab-window ul').children().length - 1);
}

function TabExists(window, name) {
    const list = $(window + ' ul li a');
    let exists = false;
    let index = 0;
    let foundIndex;
    list.each(function() {
        if ($(this).text() === name) {
            exists = true;
            foundIndex = index;
        }
        index++;
    })
    return [exists, foundIndex];
}

function PullTableName() {
    const cols = $('#minCol').val() + '-' + $('#maxCol').val() + 'x'; 
    const rows = $('#minRow').val() + '-' + $('#maxRow').val();
    return cols + rows;
}

function AddCheckBox($tab) {
    const $checkbox = $('<input type="checkbox">');
    $tab.after($checkbox[0]);
}
