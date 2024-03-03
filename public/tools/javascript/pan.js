const radius = 60;
const tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const diZhi = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];
const naYin = ["金", "火", "木", "水", "土"];
const pos = [
  [1, 3],
  [-1, 3],
  [-3, 3],
  [-3, 1],
  [-3, -1],
  [-3, -3],
  [-1, -3],
  [1, -3],
  [3, -3],
  [3, -1],
  [3, 1],
  [3, 3],
];
const canvas = document.getElementById("PanCanvas");
const ctx = canvas.getContext("2d");
const yearGanRadios = document.getElementsByName("yearGan");
function drawChart() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制十二个环形方格
  for (let i = 0; i < 12; i++) {
    const x = centerX + radius * pos[i][0];
    const y = centerY + radius * pos[i][1];
    let selectedGan;

    for (let i = 0; i < yearGanRadios.length; i++) {
      if (yearGanRadios[i].checked) {
        selectedGan = yearGanRadios[i].value;
        break;
      }
    }
    // 绘制方格
    ctx.beginPath();
    ctx.rect(x - radius / 2, y - radius / 2, radius, radius);
    ctx.fillStyle = "lightblue";
    ctx.fill();
    ctx.stroke();
    const fromYin = i < 2 ? 12 : 0;
    const gan = (selectedGan * 2 + i + fromYin) % 10;
    const zhi = i;
    const ganzhi = (((gan * 6 - zhi * 5) % 60) + 60) % 60;
    // 绘制方格编号
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tianGan[gan] + diZhi[i], x, y);

    const nayinIndex = Math.floor((Math.floor(ganzhi / 2) * (4 / 3)) % 5);
    ctx.fillText(naYin[nayinIndex], x, y + radius / 2 + 15); // Adjust the position based on your preference
    // console.log(ganzhi, nayinIndex, naYin[nayinIndex]);
  }
}

// 调用绘制函数
drawChart();
