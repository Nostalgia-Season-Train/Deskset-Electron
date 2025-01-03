#include <windows.h>

int main(int handle) {
    HWND hWnd = (HWND)handle;

    SetWindowPos(hWnd, HWND_BOTTOM, 0, 0, 0, 0,
                 SWP_NOSIZE |
                 SWP_NOMOVE |
                 SWP_NOOWNERZORDER |
                 SWP_NOACTIVATE
                );

    return 0;
}
