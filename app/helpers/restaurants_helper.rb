module RestaurantsHelper

  def standard_time(string)
    p string
    time = string.gsub(/[:]/, "")
    if time.include?("12")
      result = time.gsub(/^\d{2}/, '12:')
    elsif string == "0"
      result = "-CLOSED-"
    elsif time > ("1200")
      first_two = time.match(/^\D*(\d)\D*(\d)/).captures.join
      new_hour = first_two.to_i - 12
      result = time.gsub(/^\d{2}/, new_hour.to_s + ':')
      result = result + " PM"
    else
      p time
      p time.match(/^\D*(\d)\D*(\d)/)
      first_two = time.match(/^\D*(\d)\D*(\d)/).captures.join
      result = time.gsub(/^\d{2}/, first_two + ':')
      result = result + " AM"
    end

    result
  end

  def hours_parse(hours_in_json)
    arr = hours_in_json.map{|day| day}
    days = []
    lunch_hours = []
    dinner_hours =[]
    i = 0
    until i == arr.length - 1
      days << arr[i][0]
      lunch_hours << arr[i][1]["lunch"]
      dinner_hours << arr[i][1]["dinner"]
      i += 1
    end

  lunch_hours.flatten
  dinner_hours.flatten
  info_hash = {day_list: days, lunch: lunch_hours, dinner: dinner_hours}
  end



  def hours_show(hours)
    hash = hours_parse(hours)
    display = []
    # puts hash
    i = 0
    until i == hash[:day_list].length - 1
      if hash[:lunch][i][1] == "0" && hash[:dinner][i][0] == "0"
        display << hash[:day_list][i].capitalize  + ":  Open From: " +  standard_time(hash[:lunch][i][0]) + " -  " + standard_time(hash[:dinner][i][1])
      else
        display << hash[:day_list][i].capitalize  +  ":  Lunch: " +  standard_time(hash[:lunch][i][0]) + " - " + standard_time(hash[:lunch][i][1]) + " || Dinner: " +  standard_time(hash[:dinner][i][0]) + " - " + standard_time(hash[:dinner][i][1])
      end
      i += 1
    end

    display
  end

end
