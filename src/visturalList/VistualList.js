class FsVirtuallist {
    constructor(containerSelector, listSelector) {
      this.state = {
        dataSource: [], // 模拟数据源
        itemHeight: 100, // 固定 item 高度
        viewHeight: 0, // container 高度
        maxCount: 0, // 虚拟列表视图最大容纳量
      };
      this.scrollStyle = {}; // list 动态样式（高度，偏移）
      this.startIndex = 0; // 当前视图列表在数据源中的起始索引
      this.endIndex = 0; // 当前视图列表在数据源中的末尾索引
      this.renderList = []; // 渲染在视图上的列表项
      // 根据用户传入的选择器获取 DOM 并保存
      this.oContainer = document.querySelector(containerSelector);
      this.oList = document.querySelector(listSelector);
    }
  }
