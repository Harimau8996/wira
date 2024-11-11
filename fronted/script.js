document.addEventListener('DOMContentLoaded', () => {
  let spinCount = 0; // 旋轉次數
  const spinButton = document.getElementById('spinButton');
  const canvas = document.getElementById('wheelCanvas');
  const ctx = canvas.getContext('2d');
  let segments = ['獎品 1', '獎品 2', '獎品 3', '獎品 4', '獎品 5', '獎品 6']; // 默認的獎項數據
  let segmentCount = segments.length;

  // 用戶身份驗證檢查
  async function checkUserAuthentication() {
    try {
      const response = await fetch('https://your-auth-server.com/api/check-login', {
        method: 'GET',
        credentials: 'include' // 包含cookie
      });
      const data = await response.json();
      if (data.isAuthenticated) {
        return true;
      } else {
        showLoginModal(); // 顯示登錄提示框
        return false;
      }
    } catch (error) {
      console.error('身份驗證失敗:', error);
      showLoginModal(); // 出錯時也顯示登錄提示框
      return false;
    }
  }

  function showLoginModal() {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div class="modal">
        <p>Belum diautentikasi</p>
        <p>Sila log masuk dari MBI8 terlebih dahulu, kemudian kembali ke sini.</p>
        <button id="loginButton">Log Masuk Sekarang</button>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('loginButton').addEventListener('click', () => {
      window.location.href = 'https://mrwira8.live/login'; // 替换为实际的登录页面 URL
    });
  }

  // 從伺服器獲取獎項數據
  fetch('https://mrwira.com/api/v1/index.php')
    .then(response => response.json())
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        segments = data; // 更新獎項數據
        segmentCount = segments.length; // 更新段數
        drawWheel(); // 重新繪製輪盤
      } else {
        console.warn('獲取到的數據無效或為空，使用默認的獎項數據');
        drawWheel(); // 繪製輪盤
      }
    })
    .catch(error => {
      console.error('錯誤:', error);
      drawWheel(); // 如果出錯，使用默認數據繪製輪盤
    });

  // 繪製輪盤
  function drawWheel() {
    const arc = Math.PI * 2 / segmentCount;
    let startAngle = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
    segments.forEach((segment, i) => {
      ctx.beginPath();
      ctx.arc(200, 200, 150, startAngle, startAngle + arc, false);
      ctx.lineTo(200, 200);
      ctx.fillStyle = i % 2 === 0 ? '#f39c12' : '#e74c3c';
      ctx.fill();
      ctx.stroke();
      ctx.save();

      // 繪製文字
      ctx.translate(200, 200);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(segment, 140, 10);
      ctx.restore();

      startAngle += arc;
    });
  }

  // 旋轉邏輯
  spinButton.addEventListener('click', async () => {
    const isAuthenticated = await checkUserAuthentication();
    if (!isAuthenticated) {
      return; // 未认证用户不能使用转轮
    }

    if (spinCount <= 0) {
      alert('請選擇旋轉次數！');
      return;
    }

    // 旋轉邏輯
    const spinAngle = Math.random() * 360 + 1080; // 3 圈加上一個隨機角度
    const duration = 3000;

    canvas.style.transition = `transform ${duration}ms ease-out`;
    canvas.style.transform = `rotate(${spinAngle}deg)`;

    setTimeout(() => {
      const winningIndex = Math.floor(((spinAngle % 360) / 360) * segments.length);
      document.getElementById('result').textContent = `你贏得了：${segments[winningIndex]}`;
      canvas.style.transition = ''; // 重置過渡
      canvas.style.transform = ''; // 重置旋轉

      spinCount -= 1;
      if (spinCount <= 0) {
        spinButton.disabled = true;
      }
    }, duration);
  });

  // 選擇旋轉次數
  document.querySelectorAll('.spin-option').forEach(button => {
    button.addEventListener('click', () => {
      spinCount = parseInt(button.dataset.spins, 10);
      spinButton.disabled = false;
      document.getElementById('result').textContent = `你選擇了 ${spinCount} 次旋轉`;
    });
  });
});
