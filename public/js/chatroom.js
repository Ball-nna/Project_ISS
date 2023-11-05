
(function connect(){
    let socket = io.connect("http://localhost:7777");
    let username = document.querySelector('#username');
    let usernameBtn = document.querySelector('#usernameBtn');
    let curUsername = document.querySelector('.card-header');
    let secretKey = "yakdaigradeakub"; // กำหนดคีย์ลับที่ใช้ในการเข้ารหัส/ถอดรหัส

    // Button สำหรับ Add Event ตอนกดเปลี่ยนชื่อ
    usernameBtn.addEventListener('click' , e => {
        console.log(username.value);
        socket.emit('change_username',{ username: username.value });
        curUsername.textContent = username.value + " is Typing";
        username.value = '';
    });

    let message = document.querySelector('#message');
    let messageBtn = document.querySelector('#messageBtn');
    let messageList = document.querySelector('#message-list');

    // Event การใส่ข้อความ
    messageBtn.addEventListener('click', e => {
        console.log(message.value);
        // เข้ารหัสข้อความก่อนส่งไปยังเซิร์ฟเวอร์
        let encryptedText = CryptoJS.AES.encrypt(message.value, secretKey).toString();
        socket.emit('new_massage', { message: encryptedText });
        console.log("ผลลัพธ์การเข้ารหัส : "+encryptedText)
        message.value = '';
    });

    // รับข้อความและแสดง
    socket.on('receive_message', data => {
        console.log(data);
        // ถอดรหัสข้อความที่ได้รับ
        let decryptedText = CryptoJS.AES.decrypt(data.message, secretKey).toString(CryptoJS.enc.Utf8);
        let listItem = document.createElement('li');
        listItem.textContent = data.username + " : " + decryptedText;
        listItem.classList.add('list-group-item');
        messageList.appendChild(listItem);
    });

    // Event ที่แสดงให้เห็นว่าผู้ใช้กำลังพิมพ์
    let info = document.querySelector('.info');
    message.addEventListener('keypress' , e => {
        socket.emit('typing');
    });

    socket.on('typing', data => {
        info.textContent = data.username + " กำลังพิมพ์...";
        setTimeout(() => { info.textContent = ''; }, 5000);
    });
})();
