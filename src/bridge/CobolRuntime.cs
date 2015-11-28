public static class CobolRuntime
{
	public static string ToCobolString(string str , int size) {
		return str.PadRight(size);
	}

	public static string ToCobolString(int num, int size, bool signed = false)
	{
		if (signed) {
			return (num >= 0? "+" : "") + num.ToString ("D" + size);
		} else {
			return num.ToString ("D" + size);
		}
	}
}