#define UNICODE
#define _UNICODE

#include <Windows.h>

BOOL CALLBACK findDefView(HWND hWnd, LPARAM lParam) {
  // 1、获取窗口类名
  WCHAR lpClassName[256];
  GetClassNameW(hWnd, lpClassName, 256);

  // 2、判断窗口类名，是不是 WorkerW
  if (wcscmp(lpClassName, L"WorkerW") == 0) {
    // 3、如果是，查找 DefView
    HWND hDefView = FindWindowExW(hWnd, 0, L"SHELLDLL_DefView", 0);

    // 4、如果找到，返回数据并结束遍历
    if (hDefView != NULL) {
      HWND *pReturn = (HWND *)lParam;
      *pReturn = hWnd;
      return FALSE;
    }
  }

  return TRUE;
}

HWND getWorkerW() {
  HWND hWorkerW = NULL;

  EnumWindows(findDefView, (LPARAM)&hWorkerW);  // 找到有 DefView 的 WorkerW 窗口

  return hWorkerW;
}

void send0x52C() {
  SendMessageTimeoutW(FindWindowW(L"Progman", 0), 0x52C, 0, 0, 0, 100, 0);
}

int main(int handleElectron, int howToKeepOnDesktop) {
  HWND hElectron = (HWND)(uintptr_t)handleElectron;

  // 第一步：发送 0x52C 指令
  send0x52C();

  // 第二步：按照 howToKeepOnDesktop 选择窗口置底方案
  switch (howToKeepOnDesktop) {
    case 0:
      // 方案一：设为 WorkerW 窗口的子窗口
      HWND hWorkerW = getWorkerW();
      if (hWorkerW != NULL) {
        SetParent(hElectron, hWorkerW);
        break;
      } else {
        return 1001;
      }
    case 1:
      // 方案二：z-index 置底
      SetWindowPos(hElectron, HWND_BOTTOM, 0, 0, 0, 0,
                   SWP_NOSIZE |
                   SWP_NOMOVE |
                   SWP_NOOWNERZORDER |
                   SWP_NOACTIVATE
                  );
      break;
    default:
      return 1;
  }

  return 0;
}
