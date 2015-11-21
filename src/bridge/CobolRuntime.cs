public static class CobolRuntimeExtensions
{
	public static string ToCobolString(this string str , int size) {
		return str.PadRight(size);
	}

	public static string ToCobolString(this int num , int size) {
		return num.ToString("D"+size);
	}
}