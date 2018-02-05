if prefix == "OP" {
   		actLine := []string{"Total Cost - ex restructuring", "OP excl. restr"}
   		Where.Set("act_line", tk.M{}.Set("$in", actLine))
   	} else if prefix == "DETAIL"{
   		actLine := []string{"Direct Cost - ex Restructuring", "Allocated Cost - ex Retsructuring"}
   		Where.Set("act_line", tk.M{}.Set("$in", actLine))
   	}
