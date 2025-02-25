#include <Windows.h>

// 将 spy++ 拿到的 Handle(十六进制数字) 转换成 HWND
HWND numHandle(int num) {
  return (HWND)(uintptr_t)num;
}

int main(void) {}
