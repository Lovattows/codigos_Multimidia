#include <opencv2/opencv.hpp>
#include <iostream>

using namespace std;
using namespace cv;
int main() {

	Mat image1 = imread("image1.png");
	Mat image2 = imread("image2.png");

	Mat diff;
	absdiff(image1, image2, diff);

	imshow("1ª", image1);
	imshow("2ª", image2);
	imshow("res", diff);
	waitKey();
	return 0;
}
