ajaxPost("/generatedashboard/createsummaryintrareceiver", "", function (res){
 console.log(res);
    })

ajaxPost("/generatedashboard/createsummaryintrasupplier", "", function (res){
 console.log(res);
    })

ajaxPost("/generatedashboard/createclassification", "", function (res){
 console.log(res);
    })




if prefix == "OP" {
   		actLine := []string{"Total Cost - ex restructuring", "OP excl. restr"}
   		Where.Set("act_line", tk.M{}.Set("$in", actLine))
   	} else if prefix == "DETAIL"{
   		actLine := []string{"Direct Cost - ex Restructuring", "Allocated Cost - ex Retsructuring"}
   		Where.Set("act_line", tk.M{}.Set("$in", actLine))
   	}


db.RawOCIRTranche.aggregate([
{
    $match : 
    {
        suppliertype : {$in : ["IGS","Teams"]},
        suppliercountry : "SINGAPORE",
        //region : "ASEAN & South Asia",
        $or :[   
            { $and : [{receivercountry : "SINGAPORE"},{receiverlegalentity : "Standard Chartered Bank"}] },
            { $and : [{receivercountry : "UNITED ARAB EMIRATES"},{receiverlegalentity : "Standard Chartered Bank"}] },
            { $and : [{receivercountry : "HONG KONG"},{receiverlegalentity : "Standard Chartered Bank (Hong Kong) Limited"}] },
            { $and : [{receivercountry : "UNITED KINGDOM"},{receiverlegalentity : "Standard Chartered Bank"}] },
            { $and : [{receivercountry : "UNITED STATES OF AMERICA"},{receiverlegalentity : "Standard Chartered Bank"}] },
          ]
        
        /*$or :[   
            { $and : [{suppliercountry : "INDIA"},{supplierlegalentity : "Standard Chartered Global Business Services Private Limited"}] },
            { $and : [{suppliercountry : "MALAYSIA"},{supplierlegalentity : "Standard Chartered Global Business Services Sdn Bhd"}] },
            { $and : [{suppliercountry : "CHINA"},{supplierlegalentity : "Standard Chartered Global Business Services Co., Ltd."}] },
          ]*/
        
        
    }
}
,{
    $project :
    {
        SameCountry : {$ne : ["$receivercountry","$suppliercountry"]}
        , parentprocessname : 1
    }
},{
    $match :
    {
        SameCountry : true
    }
},{
    $group :
    {
         _id : ""
        , aaa : {$addToSet : "$parentprocessname"}
    }
}
])
