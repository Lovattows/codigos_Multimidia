#include <opencv2/core/core.hpp>
#include <opencv2/highgui/highgui.hpp>
#include <opencv2/imgproc/imgproc.hpp>
#include <vector>

using namespace cv;
using namespace std;

int main()
{
	Mat src = imread("Atividade2.png");

	int red = 255, green = 255, blue = 255;

	string name = "trackBar";
	namedWindow(name);

	createTrackbar("RED", name, &red, 255);
	createTrackbar("GREEN", name, &green, 255);
	createTrackbar("BLUE", name, &blue, 255);

	Mat resultado;
	int key = 0;

	do
	{
		inRange(src, Scalar(blue, green, red), Scalar(blue, green, red), resultado);

		cv::resize(resultado, resultado, cv::Size(), 0.5, 0.5);

		imshow(name, resultado);

		key = waitKey();
	} while ((char)key != 27);

	waitKey();

	return 0;
}