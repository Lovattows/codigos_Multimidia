#include "opencv2/imgcodecs.hpp"
#include "opencv2/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include <iostream>

using namespace cv;

using std::cin;
using std::cout;
using std::endl;

int main(void)
{
	double alpha = 1.0; /*< Simple contrast control */
	int beta = 0;       /*< Simple brightness control */

	Mat image = imread("Atividade3.jpg");
	Mat new_image = Mat::zeros(image.size(), image.type());

	for (int y = 0; y < image.rows; y++) {
		for (int x = 0; x < image.cols; x++) {
			for (int c = 0; c < 3; c++) {
				new_image.at<Vec3b>(y, x)[c] =
					saturate_cast<uchar>(1.3*(image.at<Vec3b>(y, x)[c]) + 40);
			}
		}
	}
	namedWindow("Original Image", WINDOW_AUTOSIZE);
	namedWindow("New Image", WINDOW_AUTOSIZE);
	imshow("Original Image", image);
	imshow("New Image", new_image);
	waitKey();
	return 0;
}
