---
title: angular 绕弯实现 react 动态组件传值解构透传方法
subtitle: Angular Bending Method for Realizing Dynamic Component Value Transmission, Deconstructing, and Transparent Transmission in React
date: 2023-11-19 22:01:26
toc: true
tags: 
categories: 
    - 默认
---

angular 绕弯实现 react 动态组件传值解构透传方法

实现：`hoc.component.ts`
```ts
import { AfterViewInit, Component, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-hoc',
  template: ` <ng-template #hoc />`,
})
export class HocComponent implements AfterViewInit {
  @ViewChild('hoc', { read: ViewContainerRef })
  private container!: ViewContainerRef;
  @Input()
  component: Type<Component> | undefined;
  @Input()
  options: unknown;

  ngAfterViewInit(): void {
    if (this.component === undefined) {
      throw new Error('this.component can not be undefined');
    }
    const ref = this.container.createComponent(this.component);
    if (!this.options) return;
    Object.assign(ref.instance, this.options);
    ref.changeDetectorRef.detectChanges();
  }
}
```

用法：`home.component.html`
```html
<app-hoc [component]="component" [options]="options" />
```