#include "opencv2/imgproc/imgproc.hpp"
#include "opencv2/highgui/highgui.hpp"

using namespace std;
using namespace cv;

int main() {

	Mat src, hsv, bw;

	src = imread("Atividade7.jpg");
	blur(src, src, Size(3, 3));

	cvtColor(src, hsv, cv::COLOR_BGR2HSV);

	inRange(hsv, Scalar(0, 10, 60), Scalar(20, 150, 255), bw);
	imshow("src", src);
	imshow("dst", bw);

	waitKey(0);
	return 0;
}
