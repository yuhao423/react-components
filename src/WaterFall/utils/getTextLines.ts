/**  
* 计算文本数组在指定字体大小和容器宽度下的行数  
* @param texts - 要渲染的文本数组  
* @param fontSize - 字体大小（以像素为单位）  
* @param lineHeight - 字体高度（以像素为单位）  
* @param containerWidth - 容器宽度（以像素为单位）  
* @param maxLine - 最大行数（以像素为单位）  
* @returns 每个文本实际渲染时的行数数组  
*/  

function createDiv(style: string): HTMLDivElement {  
    const div = document.createElement('div');  
    div.style.cssText = style;  
    document.body.appendChild(div);  
    return div;  
}  
function removeElement(element: HTMLElement): void {
    if (element.parentNode) {
        element.parentNode.removeChild(element);
    }
}

export function calculateTextLines(  
    texts: string[],  
    fontSize: number,  
    lineHeight: number,  
    containerWidth: number,  
    maxLine?: number  
): number[] {  
// 创建一个带有指定样式的 div 元素  
console.log(texts,fontSize,lineHeight,containerWidth);

    const div = createDiv(`font-size: ${fontSize}px; line-height: ${lineHeight}px; width: ${containerWidth}px; white-space: pre-wrap;`);  
    const results: number[] = [];  
    texts.forEach((text) => {  
        div.textContent = text;  
        // 获取 div 的高度，并根据字体大小计算行数  
        const divHeight = div.offsetHeight;  
        const lines = Math.ceil(divHeight / lineHeight);  
        maxLine && lines > maxLine ? results.push(maxLine) : results.push(lines);  
    });  
  
    // 清理 div  
    removeElement(div);  

    return results;  
}  
