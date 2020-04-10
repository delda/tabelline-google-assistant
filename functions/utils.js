const matchAll = (regexp, string) => {
    var match, results = [];
    var re = RegExp(regexp,'g');

    do {
        match = re.exec(string);
        if (match) results.push(match[0]);
    } while (match);

    return results;
};

module.exports = {
    matchAll,
};