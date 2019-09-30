#include "opencv2/imgproc/imgproc.hpp"
#include "opencv2/highgui/highgui.hpp"

using namespace std;
using namespace cv;

int MAX_KERNEL_LENGTH = 31;

int main() {

	Mat src = imread("Atividade4.png");
	Mat image;
	
	cv::medianBlur(src, image, 7);

	for (int i = 1; i < MAX_KERNEL_LENGTH; i = i + 2)
	{
		medianBlur(src, image, i);
	}

	cv::resize(src, src, cv::Size(), 0.5, 0.5);
	cv::resize(image, image, cv::Size(), 0.5, 0.5);

	imshow("src", src);
	imshow("image", image);
	waitKey(0);
}
