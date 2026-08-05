#import <Foundation/Foundation.h>
#import <PDFKit/PDFKit.h>

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    if (argc < 2) return 2;
    NSString *path = [NSString stringWithUTF8String:argv[1]];
    PDFDocument *document = [[PDFDocument alloc] initWithURL:[NSURL fileURLWithPath:path]];
    if (!document) return 1;
    for (NSInteger index = 0; index < document.pageCount; index++) {
      NSString *text = [[document pageAtIndex:index] string];
      printf("--- PAGE %ld ---\n%s\n", (long)index + 1, text.UTF8String ?: "");
    }
  }
  return 0;
}
