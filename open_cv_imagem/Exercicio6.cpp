#include <opencv2/opencv.hpp>
#include <iostream>
using namespace std;
using namespace cv;
int main() {

	Mat src = imread("Atividade6.jpg");

	Mat bgr[3];   
	split(src, bgr);

	cv::resize(src, src, cv::Size(), 0.3, 0.3);
	cv::resize(bgr[0], bgr[0], cv::Size(), 0.3, 0.3);
	cv::resize(bgr[1], bgr[1], cv::Size(), 0.3, 0.3);
	cv::resize(bgr[2], bgr[2], cv::Size(), 0.3, 0.3);

	imshow("original", src);
	imshow("blue",bgr[0]);
	imshow("green", bgr[1]);
	imshow("red", bgr[2]);
	

	waitKey();
	return 0;
}
