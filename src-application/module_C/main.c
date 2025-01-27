#define UNICODE
#define _UNICODE

#include <Windows.h>

BOOL CALLBACK findDefView(HWND hWnd, LPARAM lParam) {
  // 1、获取窗口类名
  WCHAR lpClassName[256];
  GetClassNameW(hWnd, lpClassName, 256);

  // 2、判断窗口类名，是不是 Progman 或 WorkerW
  if (wcscmp(lpClassName, L"Progman") == 0 || wcscmp(lpClassName, L"WorkerW") == 0) {
    // 3、如果是，查找 DefView
    HWND hDefView = FindWindowExW(hWnd, 0, L"SHELLDLL_DefView", 0);

    // 4、如果找到，返回数据并结束遍历
    if (hDefView != NULL) {
      HWND *pReturn = (HWND *)lParam;
      *pReturn = hDefView;
      return FALSE;
    }
  }

  return TRUE;
}

HWND getDefView() {
  HWND hDefView = NULL;

  EnumWindows(findDefView, (LPARAM)&hDefView);

  return hDefView;
}

int main(int handleElectron, int howToKeepOnDesktop) {
  HWND hElectron = (HWND)(uintptr_t)handleElectron;

  switch (howToKeepOnDesktop) {
    case 0:
      HWND hDefView = getDefView();
      if (hDefView != NULL) {
        SetParent(hElectron, hDefView);
        break;
      } else {
        return 1001;
      }
    case 1:
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
