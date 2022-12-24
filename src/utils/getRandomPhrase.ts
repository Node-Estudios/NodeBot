export default function getRandomPhrase(phrases: any) {
    if (typeof phrases != 'object') return phrases;
    let maximum = Object.keys(phrases).length;
    let minimum = 1;
    new Promise((resolve, reject) => {
        const random = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        resolve(phrases[random]);
    }).then(string => {
        if (string) return string;
        else return phrases[1];
    });
}
