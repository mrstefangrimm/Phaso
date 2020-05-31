#include "Arduino.h"

#if __cplusplus >= 201402L
void operator delete(void* p, size_t n)
{
  delete(p);
}
#endif
