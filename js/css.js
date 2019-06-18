(function (win) {
  const transformAttr = ['rotate', 'rotateX', 'rotateY', 'rotateZ', 'rotate3d', 'translate', 'translateX', 'translateY', 'translateZ', 'translate3d', 'scale', 'scaleX', 'scaleY', 'scaleZ', 'scale3d', 'skew', 'skewX', 'skewY'];
  const needParse = ['width', 'height', 'opacity'];

  const type = (el) => {
    const reg = /\[object (\w+)\]/;
    const str = Object.prototype.toString.call(el);
    return reg.exec(str)[1].toLowerCase();
  }

  const css = (
    el,
    attr
  ) => {
    const toSet = type(attr) === 'object' ? true : false;
    if (!el.transform) {
      el.transform = {};
    }
    if (toSet) {
      // 设置属性
      // 设置常规css
      let sty = {};
      // 设置transform的css
      let transformSty = '';
      for (let key in attr) {
        if (transformAttr.includes(key)) {
          // 保存transform，方便取
          el.transform[key] = attr[key];
          if (key.includes('translate')) {
            // translate
            transformSty += `${key}(${attr[key]}px) `;
          } else if (key.includes('scale')) {
            // scale
            transformSty += `${key}(${attr[key]}) `;
          } else {
            // rotate skew
            transformSty += `${key}(${attr[key]}deg) `;
          }
        } else {
          if (key === 'width' || key === 'height') {
            sty[key] = attr[key] + 'px';
          } else {
            sty[key] = attr[key];
          }
        }
      }
      if (transformSty) {
        Object.assign(sty, {
          transform: transformSty
        });
      }
      for ([k, v] of Object.entries(sty)) {
        el.style[k] = v;
      }
    } else {
      // 获取属性
      if (transformAttr.includes(attr)) {
        return el.transform[attr] || (attr.includes('scale') ? 1 : 0);
      } else {
        const result = win.getComputedStyle(el)[attr] || el.currentStyle[attr];
        if (needParse.includes(attr)) {
          return parseFloat(result);
        }
        return result;
      }
    }
  }

  win.css = css;
})(window)
