#include <iostream>
#include <sstream>
#include <opencv2/imgcodecs.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/videoio.hpp>
#include <opencv2/highgui.hpp>
#include <opencv2/video.hpp>

using namespace cv;
using namespace std;

int main()
{
	Ptr<BackgroundSubtractor> removeBg;
	
	removeBg = createBackgroundSubtractorKNN();

	VideoCapture capture(samples::findFile("Atividade1.avi"));

	Mat src, nobg;
	while (true) {
		capture >> src;

		removeBg->apply(src, nobg);

		imshow("Original", src);
		imshow("No background", nobg);

		waitKey(30);
	}
	return 0;
}

