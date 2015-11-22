public static class CobolRuntimeExtensions
{
	public static string ToCobolString(this string str , int size) {
		return str.PadRight(size);
	}

	public static string ToCobolString(this int num, int size, bool signed = false)
	{
		if (signed) {
			return (num >= 0? "+" : "") + num.ToString ("D" + size);
		} else {
			return num.ToString ("D" + size);
		}
	}
}