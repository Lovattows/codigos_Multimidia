#include "opencv2/imgcodecs.hpp"
#include "opencv2/highgui.hpp"
#include <iostream>

using namespace cv;

using std::cin;
using std::cout;
using std::endl;

int main(void)
{
	Mat src;

	src = imread("Atividade1.jpg");

	if (src.empty()) { cout << "Erro ao carregar a imagem" << endl; return -1; }

	Mat imageContrastHigh = src.clone();
	Mat imageContrastLow = src.clone();

	src.convertTo(imageContrastHigh, -1, 10, 0);
	src.convertTo(imageContrastLow, -1, 0.25, 0);

	imshow("Imagem", src);
	imshow("Contraste alto", imageContrastHigh);
	imshow("Contraste baixo", imageContrastLow);

	waitKey(0);

	return 0;
}
