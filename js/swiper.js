(function (win) {
  const swiper = ({
    wrap,
    ul,
    dots,
    dotActiveClass
  }) => {
    const css = win.css,
      imgLen = ul.children.length,
      imgWidth = ul.children[0].offsetWidth;
    let startDis = 0,
      endDis = 0,
      dis = 0,
      allDis = 0,
      startTime = 0,
      endTime = 0,
      timeDis = 0,
      curIndex = 1,
      dotCurIndex = 1;

    css(ul, {
      translateX: -curIndex * imgWidth
    });

    wrap.addEventListener('touchstart', e => {
      startDis = e.changedTouches[0].pageX;
      startTime = Date.now();
      css(ul, {
        transition: 'none'
      });
    })

    wrap.addEventListener('touchmove', e => {
      endDis = e.changedTouches[0].pageX;
      dis = endDis - startDis;
      allDis += dis;
      if (dis > 0 && curIndex === 0) {
        curIndex = imgLen - 2;
        css(ul, {
          translateX: -curIndex * imgWidth
        });
      }
      if (dis < 0 && curIndex === imgLen - 1) {
        curIndex = 1;
        css(ul, {
          translateX: -curIndex * imgWidth
        });
      }
      css(ul, {
        translateX: css(ul, 'translateX') + dis
      });
      startDis = endDis;
    })

    wrap.addEventListener('touchend', () => {
      endTime = Date.now();
      timeDis = (endTime - startTime) / 1000; // 换算成秒
      console.log(Math.abs(allDis / timeDis));
      if ((Math.abs(allDis) > imgWidth / 2) || (Math.abs(allDis / timeDis) >= 150)) {
        // 如果滑动的距离大于图片的一半，则自动滑到下一张，否则返回这一张
        allDis > 0 ? curIndex-- : curIndex++;
      }
      if (allDis !== 0) {
        css(ul, {
          translateX: -curIndex * imgWidth,
          transition: 'all 0.3s'
        });
      }
      if (dotCurIndex !== curIndex) {
        dots.children[dotCurIndex - 1].classList.remove(dotActiveClass);
        dotCurIndex = curIndex === 0 ? imgLen - 2 : (curIndex === imgLen - 1 ? 1 : curIndex);
        dots.children[dotCurIndex - 1].classList.add(dotActiveClass);
      }
      // 将allDis置零，防止误触
      allDis = 0;
    })
  }

  win.swiper = swiper;
})(window)
