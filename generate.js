const fs = require("fs");
const path = require("path");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { nama, pesan } = JSON.parse(event.body);
    const filename = `${Date.now()}-${nama.replace(/\s+/g, "-")}.html`;
    const filePath = path.join(__dirname, "../pages/", filename);

    const content = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ucapan Idul Fitri untuk ${nama}</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; background: url('/public/eid-mubarak.jpg') no-repeat center center/cover; color: white; padding: 20px; }
            .container { background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 10px; }
            h1 { text-shadow: 2px 2px 4px white; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Selamat Idul Fitri, ${nama}! 🙏</h1>
            <p>${pesan}</p>
            <p><a href="/">Buat Ucapan Baru</a></p>
        </div>
    </body>
    </html>
    `;

    fs.writeFileSync(filePath, content);

    return {
        statusCode: 200,
        body: JSON.stringify({ url: `/pages/${filename}` })
    };
};

