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
	Mat src;

	src = imread("Atividade2.jpg");

	if (src.empty()) { cout << "Erro ao carregar a imagem" << endl; return -1; }

	cv::Mat greyMat, colorMat;
	cv::cvtColor(src, greyMat, cv::COLOR_BGR2GRAY);
	cv::cvtColor(src, colorMat, cv::COLOR_BGR2RGB);

	imshow("Imagem", src);
	imshow("Copia negativa", greyMat);
	imshow("Copia vetores alternados", colorMat);

	waitKey(0);

	return 0;
}

