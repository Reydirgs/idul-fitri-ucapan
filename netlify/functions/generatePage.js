const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { nama, ucapan } = JSON.parse(event.body);
    if (!nama || !ucapan) {
        return { statusCode: 400, body: "Nama dan ucapan harus diisi" };
    }

    const fileName = nama.toLowerCase().replace(/\s+/g, "-") + ".html";
    const filePath = path.join(__dirname, "../../pages", fileName);

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ucapan dari ${nama}</title>
    </head>
    <body>
        <h1>Selamat Idul Fitri, ${nama}! 🌙✨</h1>
        <p>${ucapan}</p>
        <p><a href="/">Buat Ucapan Baru</a></p>
    </body>
    </html>
    `;

    fs.writeFileSync(filePath, htmlContent);

    exec("git add pages && git commit -m 'Menambahkan ucapan baru' && git push", (error) => {
        if (error) {
            console.error("Error push ke GitHub:", error);
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ url: `https://idul-fitri-ucapan.netlify.app/pages/${fileName}` }),
    };
};

