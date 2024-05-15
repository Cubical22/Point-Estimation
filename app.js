let sample_data = [1,2,3,4,4,5,6,7,8,8];
const avs = []; // format will be like: {av: Number, count: Number}
let devision_value = 5;

let max_av_count = 0;
const chart = document.querySelector(".chart");
const numbers = document.querySelector(".numbers");
const chart_els = [];

const data_groups_holder = document.querySelector(".data-group");
const groups = [];

let first = true;

function print_results(cursors) {
    // console.log(`cursors: ${cursors.join(' * ')} || ${sample_data.join(' * ')}`);
}

function handle_cursors(cursors) {
    let j = 0; // used for the end of sample data
    for (let i = cursors.length - 1; i >= 0; i--) {
        if (cursors[i] === sample_data.length - 1 - j) { // if it's at the end and blocked
            j++;
            continue;
        }

        // otherwise if it is not locked and blocked
        if (cursors[i] + 1 < sample_data.length - j) cursors[i]++;
        for (let l = i + 1; l < cursors.length; l++) { // reseting cursers after that
            cursors[l] = cursors[i] + 1 - (i + 1 - l);
        }

        break;
    }
}

function handle_end(cursors) {
    if (cursors[cursors.length - 1] === sample_data.length - 1) { // last cursor is at last place
        let success_count = 0;
        let i = sample_data.length - 1;
        while (true) {
            if (cursors[cursors.length - success_count - 1] === i) {
                i--; success_count++;
            } else {
                success_count = false;
                break;
            }

            if (success_count === cursors.length) { // all done
                break;
            }
        }

        if (success_count !== false) {
            return true; // it must end >:)
        }
    }
}

function get_av_from_sample_date(cursors) {
    let sum = 0;
    cursors.forEach(cursor => {
        sum += sample_data[cursor];
    });

    return sum / cursors.length;
}

function create_cursor_el(cursors) {
    const cursor_el = document.createElement("p");
    cursor_el.classList.add("cursor");
    cursor_el.innerText = `${cursors.map((cursor) => {
        return sample_data[cursor];
    }).join(" * ")}`

    return cursor_el;
}

function handle_av_values(av, cursors) {
    let is_done = false;
    avs.forEach(value => {
        if (value.av === av) { // the av already exists
            value.count++;
            is_done = true;

            const cursor_el = create_cursor_el(cursors);
            value.el.appendChild(cursor_el);

        }
    });

    if (!is_done) {
        const group_el = document.createElement("div");
        group_el.classList.add("group");

        const group_av_el = document.createElement("div");
        group_av_el.classList.add("group-title");
        group_av_el.innerText = `> ${Math.floor(av * 100)/100}`;

        if (Math.floor(av * 100)/100 !== av) {
            group_av_el.classList.add("hover-text");
            group_av_el.classList.add("underline");
            group_av_el.style.setProperty("--hover-value", `' ${av}'`);
        }

        const cursor_el = create_cursor_el(cursors);

        avs.push({av: av, count: 1, el: group_el});

        group_el.appendChild(group_av_el);
        group_el.appendChild(cursor_el);
        data_groups_holder.appendChild(group_el);
    }
}

function sort_avs() {
    avs.sort((a,b) => a.av - b.av);
}

function generate_the_display() {
    avs.forEach((value, index) => {
        const div = document.createElement("div");
        div.classList.add(`chart-value-${index}`);
        div.classList.add("chart-value");

        const height_value = `${value.count / max_av_count * 300}px`;
        div.innerHTML = value.count.toString();
        div.style.setProperty("--height-set", height_value);

        const percent = document.createElement("div");
        percent.classList.add("percent");
        percent.innerHTML = `${Math.ceil(value.count / max_av_count * 100)}%`

        if (value.count === max_av_count) percent.classList.add("max-percent");

        const av = document.createElement("p");
        av.classList.add("av");
        const gotten_value = Math.floor(value.av * 100)/100;
        av.innerText = `${gotten_value}`;
        if (gotten_value !== value.av) {
            av.classList.add("underline");
            av.classList.add("hover-text");
            av.style.setProperty("--hover-value", `' ${value.av}'`);
        }

        div.appendChild(av);
        div.appendChild(percent);
        chart.appendChild(div);

        chart_els.push(div);
    });

    if (first)
    for (let i = 0; i <= 100; i += 10) {
        const p = document.createElement("p");
        p.classList.add("number");

        p.innerHTML = `${i/100}-`;

        numbers.appendChild(p);
    }
}

function reset() {
    avs.forEach(value => {
        data_groups_holder.removeChild(value.el);
    });
    avs.splice(0,avs.length);

    chart_els.forEach(el => {
        chart.removeChild(el);
    });
    chart_els.splice(0,chart_els.length);
}

function main() {
    const cursors = new Array(devision_value);
    for (let i = 0; i < devision_value; i++) {
        cursors[i] = i;
    }

    let breaker = 10000;

    print_results(cursors);

    while (true) { // the main loop (ends when cursors reach their limit)
        if (breaker === 0) {
            break;
        }

        handle_cursors(cursors);

        const av = get_av_from_sample_date(cursors);
        handle_av_values(av, cursors);

        if (handle_end(cursors)) {
            print_results(cursors);
            break;
        }

        print_results(cursors);

        breaker--;
    } // FINALLY :D

    avs.forEach(value => {
        max_av_count = Math.max(max_av_count, value.count);
    });

    sort_avs();
    generate_the_display();

    first = false;
}

main();

const input_el = document.querySelector(".sample-data")
document.querySelector(".sample-data-try").addEventListener("click", ()=>{
    reset();
    const input = input_el.value.split("/");
    sample_data = JSON.parse(input[0]);
    devision_value = JSON.parse(input[1]);
    max_av_count = 0;
    main();
});

document.querySelector(".generate-random").addEventListener("click", ()=>{
    const sample_len = Math.floor(Math.random() * 8) + 5;
    const data = [];

    for (let i = 0; i < sample_len; i++) {
        data.push(Math.floor(Math.random() * 21));
    }

    input_el.value = `${JSON.stringify(data)}/${Math.floor(Math.random() * 3) + 2}`;
});